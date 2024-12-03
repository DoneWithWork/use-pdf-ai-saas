/* eslint-disable @typescript-eslint/no-unused-vars */
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import db from "../../../../prisma/db";
import { z } from "zod";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { initPinecone } from "@/lib/pinecone/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({ pdf: { maxFileCount: 10, maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user || !user.id) {
        if (!user) throw new UploadThingError("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("File uploaded");
      const createdFile = await db.file.create({
        data: {
          userId: metadata.userId,
          name: file.name,
          url: file.url,
          size: file.size,
          uploadStatus: "SUCCESS",
          key: file.key,
        },
      });
    }),
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user || !user.id) {
        throw new Error("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          userId: metadata.userId,
          name: file.name,
          url: file.url,
          size: file.size,
          uploadStatus: "PROCESSING",
          key: file.key,
        },
      });

      //index the file
      try {
        const response = await fetch(file.url);
        const blob = await response.blob();
        const loader = new PDFLoader(blob);
        const pageLevelDocs = await loader.load();
        const pagesAmount = pageLevelDocs.length;

        // vectorise the pages
        console.log("Vectorising pages");
        const pinecone = new PineconeClient();
        // Will automatically read the PINECONE_API_KEY and PINECONE_ENVIRONMENT env vars
        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

        // vectorise the embeddings
        console.log("Vectorising embeddings");
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
          model: "text-embedding-3-small",
        });

        console.log("Uploading to Pinecone");
        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          //@ts-expect-error - this is a bug in the pinecone types
          pineconeIndex,
          namespace: createdFile.id,
        });
        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
          },
        });
        console.log("done");
      } catch (error) {
        console.error("Failed to index file", error);
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: createdFile.id,
          },
        });
      }
    }), //callback when upload is complete
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
