import React from "react";
import Messages from "./Messages";
import ChatInput from "../ChatInput";
import { trpc } from "@/app/_trpc/client";
import { Loader2, XCircle } from "lucide-react";
import { ChatContextProvider } from "./ChatContext";

export default function ChatWrapper({ fileId }: { fileId: string }) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId }, // Pass the fileId as input
    {
      // Refetch every 1 second unless status is "SUCCESS" or "FAILED"
      refetchInterval: (data) =>
        data.state.data?.status === "SUCCESS" ||
        data.state.data?.status === "FAILED"
          ? false
          : 1000,
    }
  );
  if (isLoading)
    return (
      <div className="relative min-h-full bg-zinc-200 flex divide-y divide-zinc-200 flex-col justify-between gap-2 ">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p>This may take a few seconds</p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );
  if (data?.status === "PROCESSING")
    return (
      <div className="relative min-h-full bg-zinc-200 flex divide-y divide-zinc-200 flex-col justify-between gap-2 ">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Processing PDF</h3>
            <p>This won&apos;t take long.</p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );
  if (data?.status === "FAILED")
    return (
      <div className="relative min-h-full bg-zinc-200 flex divide-y divide-zinc-200 flex-col justify-between gap-2 ">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500 " />
            <h3 className="font-semibold text-xl">Too Many pages in PDF</h3>
            <p>
              Your <span className="font-medium">Free</span> Plan Supports up to
              5 pages.
            </p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );
  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <Messages fileId={fileId} />
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
}
