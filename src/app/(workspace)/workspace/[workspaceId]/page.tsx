"use client";
import { trpc } from "@/app/_trpc/client";
import ChatWrapper from "@/app/components/Chat/ChatWrapper";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
const PdfViewerComponent = dynamic(
  () => import("../../../components/PdfRenderer"),
  {
    ssr: false,
  }
);
export default function WorkSpace({
  params,
}: {
  params: {
    workspaceId: string;
  };
}) {
  const { data: workspace } = trpc.getOneWorkspace.useQuery({
    id: params.workspaceId,
  });

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
            {workspace ? (
              <Suspense
                fallback={<Loader2 className="my-24 h-6 w-6 animate-spin" />}
              >
                <PdfViewerComponent url={workspace.File[0].url} />
              </Suspense>
            ) : (
              <p>Loading</p>
            )}
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={workspace?.File[0].id || ""} />
        </div>
      </div>
    </div>
  );
}
