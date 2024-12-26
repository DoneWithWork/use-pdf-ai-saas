/* eslint-disable @typescript-eslint/no-unused-vars */
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import db from "../../../../prisma/db";
import { string, z } from "zod";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { initPinecone } from "@/lib/pinecone/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import randomColor from "randomcolor";

const f = createUploadthing();
const middleware = async ({
  req,
  input,
}: {
  req: Request;
  input: { folderId: string | null };
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id) {
    throw new UploadThingError("Unauthorized");
  }
  const subscriptionPlan = await getUserSubscriptionPlan();

  // check if user has the right subscription plan

  return { userId: user.id, subscriptionPlan, folderId: input.folderId };
};
const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: { key: string; name: string; url: string; size: number };
}) => {
  const isFileExists = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });
  if (isFileExists) return;
  const createdFile = await db.file.create({
    data: {
      userId: metadata.userId,
      name: file.name,
      url: file.url,
      size: file.size,
      uploadStatus: "SUCCESS",
      key: file.key,
      color: randomColor({ luminosity: "dark" }),
    },
  });
  if (metadata.folderId) {
    await db.folders.update({
      where: {
        userId: metadata.userId,
        id: metadata.folderId,
      },
      data: {
        Files: {
          connect: {
            id: createdFile.id,
          },
        },
      },
    });
  }
};
export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileCount: 10, maxFileSize: "4MB" } })
    .input(z.object({ folderId: z.string().nullable() }))
    .middleware(async ({ req, input }) => {
      return middleware({ req, input });
    })
    .onUploadComplete(onUploadComplete),
  studentPlanUploader: f({ pdf: { maxFileCount: 10, maxFileSize: "16MB" } })
    .input(z.object({ folderId: z.string().nullable() }))
    .middleware(async ({ req, input }) => {
      return middleware({ req, input });
    })
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileCount: 10, maxFileSize: "64MB" } })
    .input(z.object({ folderId: z.string().nullable() }))
    .middleware(async ({ req, input }) => {
      return middleware({ req, input });
    })
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
