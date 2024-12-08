"use client";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { createContext, useContext, useEffect, useState } from "react";
import UploadDocuments from "./UploadDocuments";
import { trpc } from "@/app/_trpc/client";
import Loader from "./Loader";
export const FolderIdContext = createContext<{ folderId: string }>({
  folderId: "",
});

// Custom hook to easily access folderId context
export const useFolderId = () => {
  return useContext(FolderIdContext);
};
export default function IndividualFolder({ folderId }: { folderId: string }) {
  const [thefolderId, setFolderId] = useState<string>(folderId);
  const { data: files, isLoading } = trpc.getSingleFolder.useQuery(
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
    <div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <Link href={"/dashboard/documents"}>
            <ArrowLeftIcon size={30} className="text-blue-600 cursor-pointer" />
          </Link>
          <h1 className="font-semibold text-3xl">Folder</h1>
        </div>
        <FolderIdContext.Provider value={{ folderId: thefolderId }}>
          <UploadDocuments />
        </FolderIdContext.Provider>
      </div>
      <div>
        {files && files.length > 0 ? (
          files.map((file, index) => (
            <div key={index}>
              <p>{file.name}</p>
            </div>
          ))
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
