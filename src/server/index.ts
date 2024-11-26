import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import db from "../../prisma/db";
import { z } from "zod";
import { UTApi } from "uploadthing/server";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

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
