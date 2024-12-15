"use client";
import { ArrowLeftIcon, Folder } from "lucide-react";
import Link from "next/link";
import React, { createContext, useContext, useEffect, useState } from "react";
import UploadDocuments from "../UploadDocuments";
import { trpc } from "@/app/_trpc/client";
import Loader from "../../mis/Loader";
import { DataTable } from "@/components/tables/data-table";
import { documentColumns } from "@/components/tables/DocumentColumns";
export const FolderIdContext = createContext<{ folderId: string }>({
  folderId: "",
});

// Custom hook to easily access folderId context
export const useFolderId = () => {
  return useContext(FolderIdContext);
};
export default function IndividualFolder({ folderId }: { folderId: string }) {
  const [thefolderId, setFolderId] = useState<string>(folderId);
  const { data: folder, isLoading } = trpc.getSingleFolder.useQuery(
    {
      folderId: thefolderId,
    },
    {
      retry: 3,
      refetchInterval: false,
    }
  );
  useEffect(() => {
    setFolderId(folderId);
  }, [folderId]);
  return (
    <div className="wrapper">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <Link href={"/dashboard/documents"}>
            <ArrowLeftIcon size={30} className="text-blue-600 cursor-pointer" />
          </Link>
          <h1 className="title flex flex-row items-center gap-3">
            <Folder size={30} />
            {folder?.name || "Loading..."}
          </h1>
        </div>
        <FolderIdContext.Provider value={{ folderId: thefolderId }}>
          <UploadDocuments />
        </FolderIdContext.Provider>
      </div>
      <div className="mt-4">
        {folder && folder.Files.length > 0 ? (
          <DataTable
            columns={documentColumns}
            data={folder.Files.map((file) => {
              return {
                ...file,
                createdAt: new Date(file.createdAt),
              };
            })}
          />
        ) : (
          <>
            {isLoading ? (
              <Loader message="Loading..." />
            ) : (
              <p>No files in this folder</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
