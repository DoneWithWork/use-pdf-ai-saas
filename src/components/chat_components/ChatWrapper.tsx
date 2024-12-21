import React from "react";

import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import { FileType } from "@/types/types";
import { ChatContextProvider } from "./ChatContext";
import Messages from "./message/Messages";
import ChatInput from "./ChatInput";

type ChatWrapperProps = {
  workspaceId: string;
  files: FileType[];
};

export default function ChatWrapper({ workspaceId, files }: ChatWrapperProps) {
  const { data, isLoading } = trpc.getAllFileStatuses.useQuery(
    { workspaceId }, // Pass the fileId as input
    {
      //stop refetching if successfull
      refetchInterval: (data) =>
        data.state.data?.status === "SUCCESS" ||
        data.state.data?.status === "PROCESSING"
          ? false
          : 1000,
    }
  );
  // need to check if la
  if (isLoading)
    return (
      <div className="relative min-h-full bg-zinc-200 flex divide-y divide-zinc-200 flex-col justify-between gap-2 ">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Performing nerd stuff...</h3>
            <p>This may take a few seconds</p>
          </div>
        </div>
        <ChatInput files={files} isDisabled />
      </div>
    );
  if (data?.status === "PROCESSING")
    return (
      <div className="relative min-h-full bg-zinc-200 flex divide-y divide-zinc-200 flex-col justify-between gap-2 ">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">
              Processing PDFs and doing NERD stuff
            </h3>
            <p>This won&apos;t take long.</p>
          </div>
        </div>
        <ChatInput isDisabled files={files} />
      </div>
    );
  // if (data?.status === "FAILED")
  //   return (
  //     <div className="relative min-h-full bg-zinc-200 flex divide-y divide-zinc-200 flex-col justify-between gap-2 ">
  //       <div className="flex-1 flex justify-center items-center flex-col mb-28">
  //         <div className="flex flex-col items-center gap-2">
  //           <XCircle className="h-8 w-8 text-red-500 " />
  //           <h3 className="font-semibold text-xl">Too Many pages in PDF</h3>
  //           <p>
  //             Your <span className="font-medium">Free</span> Plan Supports up to
  //             5 pages.
  //           </p>
  //         </div>
  //       </div>
  //       <ChatInput isDisabled />
  //     </div>
  //   );
  return (
    <ChatContextProvider workspaceId={workspaceId}>
      <div className="relative min-h-full bg-zinc-50 flex  flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <Messages workspaceId={workspaceId} />
        </div>
        <ChatInput files={files} />
      </div>
    </ChatContextProvider>
  );
}
