import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import db from "../../prisma/db";
import { z } from "zod";
import { UTApi } from "uploadthing/server";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

const utapi = new UTApi();
export const appRouter = router({
  getList: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    return [1, 2, 3];
  }),
  authCallback: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    console.log("hi");
    console.log(user);
    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (!user.id || !user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });
    console.log(":hi");
    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }
    return { success: true };
  }),

  // Returns a User's documents, paginated
  getUserDocumentPaginated: privateProcedure
    .input(
      z.object({
        page: z.number().min(1),
        totalItems: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const page = input.page ?? 1;
      const offset = (page - 1) * input.totalItems;
      const totalCount = await db.file.count({
        where: {
          userId,
        },
      });
      const totalPages = Math.ceil(totalCount / input.totalItems);
      const limit = 5;
      const files = await db.file.findMany({
        skip: offset, // This is the offset
        take: limit, // This is the limit
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          size: true,
          name: true,
          createdAt: true,
          workspaceId: true,
        },
      });
      return {
        files,
        totalPages,
      };
    }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    // Retrieve users from a datasource, this is an imaginary database
    const { userId } = ctx;
    return await db.file.findMany({
      where: {
        userId: userId,
      },
    });
  }),
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId: userId,
        },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      await db.file.delete({ where: { id: input.id } });
      await utapi.deleteFiles(file.key);
      //delete embeddings
      const pinecone = new PineconeClient();
      const pineconeIndex = pinecone
        .Index(process.env.PINECONE_INDEX!)
        .deleteMany({
          ids: [file.id],
        });

      return file;
    }),
  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;
      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });
      console.log(messages);
      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }
      return {
        messages: messages,
        nextCursor: nextCursor,
      };
    }),
  createNewChat: privateProcedure
    .input(
      z.object({
        ids: z.array(z.string().min(1)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const ids = input.ids;
      const workspace = await db.workspace.create({
        data: {
          userId,
          File: {
            connect: ids.map((id) => ({ id })), //connect all the files
          },
        },
      });
      if (!workspace) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      return { id: workspace.id };
      // const notVectorisedFiles = await db.file.findMany({
      //   where: {
      //     userId,
      //     id: {
      //       in: ids,
      //     },
      //     vectorStatus: "PENDING",
      //   },
      //   select: {
      //     id,
      //   },
      // });
      // consider using a transaction
      // check if each document has already been vectorised
      // if not vectorise it
      // allow user to go to next page
    }),
  vectoriseDocuments: privateProcedure
    .input(
      z.object({
        ids: z.array(z.string().min(1)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const ids = input.ids;
      const notVectorisedFiles = await db.file.findMany({
        where: {
          userId,
          id: {
            in: ids,
          },
          vectorStatus: "PENDING",
        },
      });
      if (notVectorisedFiles.length === 0) return;
      try {
        notVectorisedFiles.forEach(async (file) => {
          const res = await fetch(file.url);
          const blob = await res.blob();
          const loader = new PDFLoader(blob);
          const pageLevelDocs = await loader.load();
          const pagesAmount = pageLevelDocs.length;

          // vectorise the pages

          const pinecone = new PineconeClient();
          const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

          console.log(`Vectorising ${file.name} with ${pagesAmount} pages`);
          const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY!,
            model: "text-embedding-3-small",
          });
          console.log("Uploading to Pinecone");
          await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
            //@ts-expect-error - this is a bug in the pinecone types
            pineconeIndex,
            namespace: file.id,
          });
          await db.file.update({
            data: {
              vectorStatus: "SUCCESS",
            },
            where: {
              userId,
              id: file.id,
            },
          });
          console.log(`Done vectorising ${file.name}`);
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: userId,
        },
      });
      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),
  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),
  newChat: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const chat = await db.chat.create({
        data: {
          name: input.name,
          userId,
        },
      });
      return chat;
    }),
  createFolder: privateProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const folder = await db.folder.create({
        data: {
          userId,
          name: input.name,
        },
      });
      if (!folder) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      return true;
    }),
  renameWorkspace: privateProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const workspace = await db.workspace.update({
        where: {
          id: input.id,
          userId: userId,
        },
        data: {
          name: input.name,
        },
      });
      return workspace;
    }),
  newWorkspace: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const workspace = await db.workspace.create({
        data: {
          File: {
            connect: { id: input.fileId },
          },
          userId,
        },
      });
      return workspace;
    }),
  getOneWorkspace: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      return await db.workspace.findFirst({
        where: {
          id: input.id,
          userId,
        },
        select: {
          name: true,
          File: true,
        },
      });
    }),
  getWorkspaces: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await db.workspace.findMany({
      where: {
        userId,
      },
    });
  }),
  getChats: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await db.chat.findMany({
      where: {
        userId,
      },
    });
  }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
