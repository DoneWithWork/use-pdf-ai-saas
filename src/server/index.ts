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
import { absoluteUrl, capitalizeFirstLetter } from "@/lib/utils";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
import { DocumentType, DocumentTypes, PDFDocument } from "@/types/types";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Users, init } from "@kinde/management-api-js";

const utapi = new UTApi();
export const appRouter = router({
  createStripeSession: privateProcedure
    .input(
      z.object({
        planName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      console.log("hi");
      const billingUrl = absoluteUrl("/dashboard/billing");
      console.log(billingUrl);
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

      const subscriptionPlan = await getUserSubscriptionPlan();
      console.log(subscriptionPlan);
      if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: dbUser.stripeCustomerId,
          return_url: billingUrl,
        });
        console.log(stripeSession);
        return { url: stripeSession.url };
      }
      console.log(capitalizeFirstLetter(input.planName));
      //user is not subscribe, allow them to buy the product
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        line_items: [
          {
            price: PLANS.find(
              (plan) => plan.name === capitalizeFirstLetter(input.planName)
            )?.price.priceIds.test,
            quantity: 1,
          },
        ],
        metadata: {
          userId: userId,
        },
      });
      console.log(stripeSession);
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
  authCallback: privateProcedure.query(async () => {
    try {
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
    } catch (error) {
      console.log("Error in authCallback", error);
      throw new TRPCError({
        code: error instanceof TRPCError ? error.code : "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Unexpected error occurred.",
      });
    }
  }),
  returnSubscriptionPlan: privateProcedure.query(async () => {
    const plan = await getUserSubscriptionPlan();
    return plan;
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
      if (!folder) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const files: PDFDocument[] = folder.Files.map((file) => {
        return {
          id: file.id,
          name: file.name,
          size: file.size,
          documentType: DocumentType.PDF,
          createdAt: file.createdAt,
        };
      });
      return { ...folder, Files: files };
    }),
  // Returns a User's documents, paginated
  getUserDocumentPaginated: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

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

    const sortedData = dataToSort.sort((itemA, itemB) => {
      return (
        new Date(itemB.createdAt).getTime() -
        new Date(itemA.createdAt).getTime()
      );
    });
    const paginatedData: DocumentTypes[] = sortedData.map((item) => {
      if ("Files" in item) {
        return {
          ...item,
          documentType: DocumentType.FOLDER,
          number_of_files: item.Files.length,
        };
      } else {
        return {
          ...item,
          documentType: DocumentType.PDF,
        };
      }
    });
    return {
      files: paginatedData,
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
    .input(
      z.object({
        id: z.string(),
        isFolder: z.boolean(),
        isWorkspace: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
        console.log(folder);
        if (!folder) throw new TRPCError({ code: "NOT_FOUND" });
        //return true if the folder has any linked documents
        const hasWorkspaceLinkedDocuments = folder.Files.length > 0;
        if (hasWorkspaceLinkedDocuments) return { canDelete: false };
        else {
          return {
            canDelete: true,
          };
        }
      } else if (!input.isFolder && !input.isWorkspace) {
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
      } else {
        const workspace = await db.workspace.findFirst({
          where: {
            userId,
            id: input.id,
          },
          select: {
            Files: {
              select: {
                id: true,
              },
            },
            name: true,
          },
        });
        if (!workspace) throw new TRPCError({ code: "NOT_FOUND" });

        return { canDelete: true };
      }
    }),

  deleteSingleFileFolderOrWorkspace: privateProcedure
    .input(
      z.object({
        id: z.string(),
        isFolder: z.boolean(),
        isWorkspace: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      try {
        if (input.isFolder) {
          //check if folder has any linked documents just in case

          const folder = await db.folders.findFirst({
            where: {
              userId,
              id: input.id,
            },
            select: {
              Files: true,
            },
          });
          console.log(folder);
          if (!folder) throw new TRPCError({ code: "NOT_FOUND" });
          if (folder.Files.length > 0) {
            throw new TRPCError({ code: "BAD_REQUEST" });
          }
          await db.folders.delete({
            where: {
              userId,
              id: input.id,
            },
          });
          return { success: true };
        } else if (!input.isFolder && !input.isWorkspace) {
          const file = await db.file.delete({
            where: {
              userId,
              id: input.id,
            },
          });
          if (!file) throw new TRPCError({ code: "NOT_FOUND" });
          await utapi.deleteFiles(file.key);
          const pinecone = new PineconeClient();
          pinecone.Index(process.env.PINECONE_INDEX!).deleteMany({
            ids: [file.id],
          });
          return { success: true };
        } else {
          // Delete the workspace
          const workspace = await db.workspace.delete({
            where: {
              userId,
              id: input.id,
            },
            select: {
              Messages: true,
            },
          });
          if (!workspace) throw new TRPCError({ code: "NOT_FOUND" });
          await db.message.deleteMany({
            where: {
              workspaceId: input.id,
            },
          });

          return { success: true };
        }
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      //delete embeddings
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
  deleteUser: privateProcedure.mutation(async ({ ctx }) => {
    try {
      const { userId } = ctx;
      init();
      const user = await db.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      const params = {
        id: user.id,
      };
      // const deleteSession = await Users.deleteUserSessions({ userId: user.id });
      // console.log(deleteSession);
      // if (deleteSession.code !== "OK") {
      //   console.log("Error deleting user sessions from kinde api");
      //   return { success: false };
      // }
      const deletedUser = await Users.deleteUser(params);
      if (deletedUser.code !== "OK") {
        console.log("Error deleting user from kinde api");
        return { success: false };
      }
      //cascade delete all references to user
      const deletedUserFromDb = await db.user.delete({
        where: {
          id: userId,
        },
        select: {
          stripeSubscriptionId: true,
          File: {
            select: {
              id: true,
              key: true,
            },
          },
        },
      });

      const fileIds = deletedUserFromDb.File.map((file) => file.id);
      const fileKeys = deletedUserFromDb.File.map((file) => file.key);
      if (deletedUserFromDb.stripeSubscriptionId) {
        await stripe.subscriptions.cancel(
          deletedUserFromDb.stripeSubscriptionId
        );
      } else {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      await utapi.deleteFiles(fileKeys);
      if (fileIds.length > 0) {
        const pinecone = new PineconeClient();
        await pinecone.Index(process.env.PINECONE_INDEX!).deleteMany({
          ids: fileIds,
        });
      }

      return { success: true };
    } catch (error) {
      console.log("Error deleting user", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
  createNewChat: privateProcedure
    .input(
      z.object({
        ids: z.array(z.string().min(1)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const subscription = await getUserSubscriptionPlan();

      const plan = PLANS.find((plan) => plan.name === subscription.name);
      if (!plan) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      if (input.ids.length > plan.quota) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You have exceeded the number of documents allowed for your plan",
        });
      }
      if (plan.name !== "Pro") {
        const numberOfWorkspaces = await db.workspace.count({
          where: {
            userId,
          },
        });
        if (numberOfWorkspaces > plan.workspaces)
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You have exceeded the number of workspaces allowed for your plan",
          });
      }
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
      console.log(ids);
      const subscriptionPlan = await getUserSubscriptionPlan();
      const plan = PLANS.find((plan) => plan.name === subscriptionPlan.name);
      if (!plan) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
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
          vectorStatus: { in: ["PENDING", "FAILED"] },
        },
      });
      if (notVectorisedFiles.length === 0) return;

      for (const file of notVectorisedFiles) {
        const res = await fetch(file.url);
        const blob = await res.blob();
        const loader = new PDFLoader(blob);
        const pageLevelDocs = await loader.load();
        const pages = pageLevelDocs.length;
        const pageCountExceeded = pages > plan.pagesPerPDF;
        console.log("Page count exceeded", pageCountExceeded);
        if (pageCountExceeded) {
          await db.file.update({
            data: { vectorStatus: "FAILED" },
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
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `You have exceeded the ${plan.pagesPerPDF} pages per PDF limit`,
          });
          return;
        }
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
      const failedFile = workspace.Files.some(
        (file) => file.vectorStatus === "FAILED"
      );
      console.log(failedFile);
      if (failedFile) {
        return { status: "FAILED" as const };
      }
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
    const workspace = await db.workspace.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        Files: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!workspace) throw new TRPCError({ code: "NOT_FOUND" });
    return workspace;
  }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
