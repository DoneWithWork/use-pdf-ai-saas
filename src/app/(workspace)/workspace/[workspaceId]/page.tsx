"use client";
import { trpc } from "@/app/_trpc/client";
import ChatWrapper from "@/components/chat_components/ChatWrapper";
import { cn, shortenName } from "@/lib/utils";
import { FileText, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

import React, { Suspense, useEffect, useState } from "react";

import WorkspaceNav from "@/components/chat_components/WorkspaceNav";
import Loader from "@/components/mis/Loader";
import { ErrorToast } from "@/components/mis/Toasts";
import { Slide, toast } from "react-toastify";
const PdfViewerComponent = dynamic(
  () => import("../../../../components/pdf/PdfRenderer"),
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

  // Vectorise all the documents in the workspace
  const { mutate: vectoriseDocs } = trpc.vectoriseDocuments.useMutation({
    onError: (error) => {
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    },

    onSuccess: () => {},
    retry: false,
  });

  const {
    data: workspace,

    isError: failedToFetchWorkspace,
  } = trpc.getOneWorkspace.useQuery(
    { id: workspaceId },
    {
      refetchInterval: false, // Remove the automatic refetch
      retry: 3,
      retryDelay: 1000,
      enabled: !!workspaceId, // Ensure query only runs after workspaceId is set
    }
  );

  // Fetch workspaceId
  useEffect(() => {
    const fetchWorkspaceId = async () => {
      const id = (await params).workspaceId;
      setWorkspaceId(id);
    };
    fetchWorkspaceId();
  }, [params]);

  // Set the default selected file and vectorise documents
  useEffect(() => {
    if (workspace && workspaceId) {
      // Set the default selected file
      setCurSelectedFile(workspace.Files?.[0]?.id || "");

      // Begin vectorising the documents/checking
      vectoriseDocs({
        ids: workspace.Files.map((file) => file.id) || [],
        workspaceId: workspaceId,
      });
    }
  }, [workspace, workspaceId, vectoriseDocs]);

  // some simple conditional rendering if loading or failed

  if (failedToFetchWorkspace) {
    return ErrorToast("Failed to fetch workspace. Please try again");
  }

  //helper function to return file URL
  const returnFileUrl = (fileId: string) => {
    const file = workspace?.Files.find((file) => file.id === fileId);
    return file?.url;
  };
  return (
    <div className=" justify-between flex flex-col w-full  h-screen max-h-screen md:overflow-hidden">
      <WorkspaceNav
        workspaceName={workspace?.name || ""}
        workspaceId={workspaceId}
      />
      <div className=" w-full max-w-8xl  h-full lg:flex   ">
        <div className="  xl:flex-1 ">
          <div className="bg-white h-full">
            {workspace ? (
              <Suspense
                fallback={<Loader2 className="my-24 h-6 w-6 animate-spin" />}
              >
                <PdfViewerComponent
                  url={returnFileUrl(curSelectedFile) || ""}
                />
              </Suspense>
            ) : (
              <Loader message="Loading your document" />
            )}
          </div>
        </div>

        <div className="shrink-0 max-w-screen flex-[0.75] border-t border-gray-200  lg:border-l lg:border-t-0">
          <ChatWrapper
            workspaceId={workspaceId}
            files={workspace?.Files || []}
          />
        </div>
        {/* Display currently selected PDF  */}
        <div className="w-full md:w-32 px-2  flex flex-row md:flex-col items-center md:justify-center gap-10  bg-white overflow-x-auto ">
          <Suspense
            fallback={<Loader2 className="my-24 h-6 w-6 animate-spin" />}
          >
            {workspace?.Files.map((file, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center relative"
              >
                <div
                  onClick={() => setCurSelectedFile(file.id)}
                  className={cn(
                    curSelectedFile === file.id
                      ? "activeDoc"
                      : "hover:bg-gray-100 bg-gray-50",
                    "mb-5 px-4 py-4 duration-200 transition-all cursor-pointer  rounded-xl"
                  )}
                >
                  <FileText size={40} className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p className="sm:text-sm font-semibold mb-2 text-xs">
                  {shortenName(file.name, 10)}
                </p>
                <div
                  className={`rounded-full w-5 h-5 flex items-center justify-center font-semibold absolute top-0 right-0 -translate-y-1/2`}
                  style={{ backgroundColor: file.color }}
                ></div>
              </div>
            ))}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
