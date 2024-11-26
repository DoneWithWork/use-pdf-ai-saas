"use client";
import { trpc } from "@/app/_trpc/client";

import { Ghost, Loader2, Trash } from "lucide-react";
import React from "react";
import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import byteSize from "byte-size";
import UploadButton from "@/app/components/UploadButton";

export default function Documents() {
  const [currentDeletingFile, setCurrentDeletingFile] = React.useState<
    string | null
  >(null);
  const utils = trpc.useUtils();
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },

    onMutate: ({ id }) => {
      setCurrentDeletingFile(id);
    },
    onSettled() {
      setCurrentDeletingFile(null);
    },
  });
  return (
    <div className="w-full">
      <h1 className="title">Documents</h1>
      <div className="">
        <UploadButton />
      </div>
      {/* Displa all files*/}
      {files && files?.length !== 0 ? (
        <ul className=" mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 sm:col-span-2 lg:col-span-3 divide-y divide-gray-200 rounded-lg bg-white transition shadow-lg  "
              >
                <div className="px-2 py-3 flex flex-row justify-between items-center">
                  <h3 className="truncate text-lg font-medium">{file.name}</h3>
                  <p>{format(new Date(file.createdAt), "dd/MM/yyyy")}</p>
                  <p>{byteSize(file.size).toString()}</p>
                  <Button
                    onClick={() => deleteFile({ id: file.id })}
                    size={"sm"}
                    variant={"destructive"}
                    className=""
                  >
                    {currentDeletingFile === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3>Pretty Empty Around Here</h3>
        </div>
      )}
    </div>
  );
}
