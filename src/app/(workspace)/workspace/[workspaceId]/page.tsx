"use client";
import { trpc } from "@/app/_trpc/client";
import ChatWrapper from "@/components/Chat/ChatWrapper";
import { cn, shortenName } from "@/lib/utils";
import { FileText, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

import React, { Suspense, useEffect, useState } from "react";

import { ErrorToast } from "@/components/Toasts";
import WorkspaceNav from "@/components/WorkspaceNav";
const PdfViewerComponent = dynamic(
  () => import("../../../../components/PdfRenderer"),
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
  const { mutate: vectoriseDocs, isPending: isVectorising } =
    trpc.vectoriseDocuments.useMutation({
      onSuccess: () => {
        console.log("Success");
      },
      onError: (error) => {
        console.log(error);
        return ErrorToast(`Error: ${error.message}`);
      },
      retry: 3,
      retryDelay: 3000,
    });

  const {
    data: workspace,
    isLoading: isFetchingWorkspace,
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
      setCurSelectedFile(workspace.File?.[0]?.id || "");

      // Begin vectorising the documents/checking
      vectoriseDocs({
        ids: workspace.File.map((file) => file.id) || [],
        workspaceId: workspaceId,
      });
    }
  }, [workspace, workspaceId, vectoriseDocs]);

  // some simple conditional rendering if loading or failed

  if (isFetchingWorkspace) {
    return (
      <div>
        <p>Fetching your workspace</p>
        <Loader2 className="my-24 h-6 w-6 animate-spin" />;
      </div>
    );
  }
  if (failedToFetchWorkspace) {
    return ErrorToast("Failed to fetch workspace. Please try again");
  }

  if (isVectorising)
    return (
      <div>
        <p>Vectorising yours PDFs. Please wait</p>
        <Loader2 className="my-24 h-6 w-6 animate-spin" />;
      </div>
    );

  //helper function to return file URL
  const returnFileUrl = (fileId: string) => {
    const file = workspace?.File.find((file) => file.id === fileId);
    return file?.url;
  };
  return (
    <div className=" justify-between flex flex-col w-full  h-screen max-h-screen md:overflow-hidden">
      <WorkspaceNav workspaceName={workspace?.name || ""} />
      <div className=" w-full max-w-8xl  h-full lg:flex   ">
        <div className="  xl:flex-1 ">
          {/* Main area */}
          {workspace ? (
            <div className="bg-white h-full">
              <Suspense
                fallback={<Loader2 className="my-24 h-6 w-6 animate-spin" />}
              >
                <PdfViewerComponent
                  url={returnFileUrl(curSelectedFile) || ""}
                />
              </Suspense>
            </div>
          ) : (
            <p>Loading</p>
          )}
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper
            workspaceId={workspaceId}
            files={workspace?.File || []}
          />
        </div>
        {/* Display currently selected PDF  */}
        <div className="w-full sm:w-32 px-2 grid grid-cols-3 sm:flex sm:flex-col items-center justify-center gap-10  bg-white ">
          <Suspense
            fallback={<Loader2 className="my-24 h-6 w-6 animate-spin" />}
          >
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
                  <FileText size={40} className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p className="sm:text-sm font-semibold mb-2 text-xs">
                  {shortenName(file.name, 10)}
                </p>
              </div>
            ))}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
