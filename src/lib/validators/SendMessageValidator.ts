import z from "zod";
export const SendMessageValidator = z.object({
  workspaceId: z.string(),
  message: z.string(),
});
