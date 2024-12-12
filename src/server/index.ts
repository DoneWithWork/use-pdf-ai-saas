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
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
import { FileOrFolder } from "@/types/message";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const utapi = new UTApi();
export const appRouter = router({
  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const billingUrl = absoluteUrl("/dashboard/billing");

    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds.test,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
    });

    return { url: stripeSession.url };
  }),
  getList: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    return [1, 2, 3];
  }),
  renameFile: privateProcedure
    .input(z.object({ workspaceId: z.string(), newName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      await db.workspace.update({
        where: {
          id: input.workspaceId,
          userId,
        },
        data: {
          name: input.newName,
        },
      });
      return { success: true };
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
  getSingleFolder: privateProcedure
    .input(z.object({ folderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const folder = await db.folders.findFirst({
        where: {
          id: input.folderId,
          userId,
        },
        select: {
          name: true,
          Files: true,
          createdAt: false,
        },
      });
      return folder;
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
      const [files, folders] = await Promise.all([
        db.file.findMany({
          where: {
            userId,
          },
        }),
        db.folders.findMany({
          where: {
            userId,
          },
          select: {
            name: true,
            id: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            Files: {
              select: {
                id: true,
              },
            },
          },
        }),
      ]);
      const fileIdsInFolders = new Set(
        folders.flatMap((folder) => folder.Files.map((file) => file.id))
      );

      // Filter files to include only those not in folders
      const filesNotInFolders = files.filter(
        (file) => !fileIdsInFolders.has(file.id)
      );

      // Combine files not in folders and folders
      const dataToSort = [...filesNotInFolders, ...folders];

      const totalPages = Math.ceil(dataToSort.length / input.totalItems);

      const sortedData = dataToSort.sort((itemA, itemB) => {
        return (
          new Date(itemB.createdAt).getTime() -
          new Date(itemA.createdAt).getTime()
        );
      });
      const paginatedData: FileOrFolder[] = sortedData.slice(
        offset,
        offset + input.totalItems
      );
      return {
        files: paginatedData,
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
  queryDeleteDoc: privateProcedure
    .input(z.object({ id: z.string(), isFolder: z.boolean() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      if (input.isFolder) {
        const folder = await db.folders.findFirst({
          where: {
            userId,
            id: input.id,
          },
          select: {
            Files: {
              select: {
                Workspaces: {
                  select: {
                    id: true,
                  },
                },
                name: true,
              },
            },
          },
        });
        if (!folder) throw new TRPCError({ code: "NOT_FOUND" });

        const hasWorkspaceLinkedDocuments = folder.Files.some(
          (file) => file.Workspaces.length > 0
        );
        if (hasWorkspaceLinkedDocuments)
          return {
            canDelete: false,
          };
      } else {
        const file = await db.file.findFirst({
          where: {
            userId,
            id: input.id,
          },
          select: {
            Workspaces: {
              select: {
                id: true,
              },
            },
            name: true,
          },
        });
        if (!file) throw new TRPCError({ code: "NOT_FOUND" });

        if (file.Workspaces.length > 0) return { canDelete: false };
        return { canDelete: true };
      }
    }),

  deleteDocOrFolder: privateProcedure
    .input(z.object({ id: z.string(), isFolder: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      try {
        if (input.isFolder) {
          await db.folders.delete({
            where: {
              userId,
              id: input.id,
            },
            select: {
              Files: true,
            },
          });
        } else {
          const file = await db.file.delete({
            where: {
              userId,
              id: input.id,
            },
          });
          await utapi.deleteFiles(file.key);
          const pinecone = new PineconeClient();
          pinecone.Index(process.env.PINECONE_INDEX!).deleteMany({
            ids: [file.id],
          });
        }
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      //delete embeddings

      return { success: true };
    }),
  //need to get accoding to chat history
  getWorkspaceChatMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        workspaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { workspaceId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;
      const workspace = await db.workspace.findFirst({
        where: {
          id: workspaceId,
          userId,
        },
      });
      if (!workspace) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          workspaceId,
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
          Files: {
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
        workspaceId: z.string().min(1),
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
          Workspaces: {
            //the id must match the workspace id
            some: {
              id: input.workspaceId,
            },
          },
          vectorStatus: "PENDING",
        },
      });
      if (notVectorisedFiles.length === 0) return;
      try {
        for (const file of notVectorisedFiles) {
          try {
            const res = await fetch(file.url);
            const blob = await res.blob();
            const loader = new PDFLoader(blob);
            const pageLevelDocs = await loader.load();

            const embeddings = new OpenAIEmbeddings({
              openAIApiKey: process.env.OPENAI_API_KEY!,
              model: "text-embedding-3-small",
            });

            const pinecone = new PineconeClient();
            const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

            console.log(`Vectorising ${file.name}`);
            await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
              //@ts-expect-error - this is a bug in the pinecone types
              pineconeIndex,
              namespace: file.id,
            });

            await db.file.update({
              data: { vectorStatus: "SUCCESS" },
              where: {
                Workspaces: {
                  some: {
                    id: input.workspaceId,
                  },
                },
                userId,
                id: file.id,
              },
            });

            console.log(`Done vectorising ${file.name}`);
          } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
          }
        }
      } catch (error) {
        console.log("Error vectorising documents", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  // check if all files have been vectorised and uploaded successfully
  getAllFileStatuses: privateProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const workspace = await db.workspace.findFirst({
        where: {
          userId,
          id: input.workspaceId,
        },
        select: {
          Files: true,
        },
      });
      if (!workspace) return { status: "PENDING" as const };

      //some --> if any of the files are not vectorised or uploaded exit early and return true
      const hasIncompleteFiles = workspace.Files.some(
        (file) =>
          file.uploadStatus !== "SUCCESS" || file.vectorStatus !== "SUCCESS"
      );

      if (hasIncompleteFiles) {
        return { status: "PROCESSING" as const };
      }

      // If all files are successfully processed
      return { status: "SUCCESS" as const };
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

  createFolder: privateProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const folder = await db.folders.create({
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
          Files: {
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
          Files: true,
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
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
