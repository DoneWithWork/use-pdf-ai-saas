"use client";
import { trpc } from "@/app/_trpc/client";
import ChatWrapper from "@/app/components/Chat/ChatWrapper";
import { cn, shortenName } from "@/lib/utils";
import { FileText, Loader2, Text } from "lucide-react";
import dynamic from "next/dynamic";
import React, { Suspense, useEffect, useState } from "react";
const PdfViewerComponent = dynamic(
  () => import("../../../components/PdfRenderer"),
  {
    ssr: false,
  }
);
export default function WorkSpace({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [curSelectedFile, setCurSelectedFile] = useState<string>("");

  const { data: workspace } = trpc.getOneWorkspace.useQuery(
    { id: workspaceId },
    {
      refetchInterval: false, // Remove the automatic refetch
    }
  );
  useEffect(() => {
    const fetchWorkspaceId = async () => {
      const id = (await params).workspaceId;
      setWorkspaceId(id);
    };
    fetchWorkspaceId();
    setCurSelectedFile(workspace?.File[0].id || "");
  }, [params, workspace?.File]);
  return (
    <div className=" justify-between flex flex-col h-[calc(100vh-3.5rem)]">
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
        <div className="w-32 px-2 flex flex-col items-center justify-center gap-10 h-screen bg-white">
          {workspace?.File.map((file, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center "
            >
              <div
                onClick={() => setCurSelectedFile(file.id)}
                className={cn(
                  curSelectedFile === file.id
                    ? "activeDoc"
                    : "hover:bg-gray-100",
                  "mb-5 px-4 py-4 duration-200 transition-all cursor-pointer  rounded-xl"
                )}
              >
                <FileText size={40} className="" />
              </div>
              <p className="text-sm font-semibold">
                {shortenName(file.name, 10)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
