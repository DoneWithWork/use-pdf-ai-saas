"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Cloud, File, MessageSquarePlus } from "lucide-react";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { useUploadThing } from "../uploadthing";
import { trpc } from "../../app/_trpc/client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { ErrorToast } from "../mis/Toasts";

export default function UploadButton({}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button className=" gap-1 bg-[#1067FE]">
          <MessageSquarePlus className="w-5 h-5 " />
          <p className="font-semibold text-sm">New Chat</p>
        </Button>
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <UploadDropzone setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
const UploadDropzone = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing("pdfUploader");
  const utils = trpc.useUtils();

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      console.log(file);
      //link the file to the workspace

      //close the dialog
      utils.getUserDocumentPaginated.invalidate();
      setIsOpen(false);
    },
    retry: true,
    retryDelay: 500,
  });
  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        } else {
          return (prev += 5);
        }
      });
    }, 500);
    return interval;
  };
  return (
    <Dropzone
      multiple
      onDrop={async (acceptedFiles) => {
        console.log(acceptedFiles);
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();
        const res = await startUpload(acceptedFiles);

        if (!res) {
          ErrorToast("Error uploading files");
        }
        const fileResponse = res ? res[0] : null;
        const key = fileResponse?.key;
        if (!key) {
          ErrorToast("Error uploading files");
        }

        //check if its in the db
        //handle file uploading
        //clear interval
        clearInterval(progressInterval);
        setUploadProgress(100);
        if (key) {
          startPolling({ key });
        } else {
          ErrorToast("Error uploading files. Key  is undefined");
        }
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <div className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex-center">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to Upload</span> or drag
                  and drop
                </p>
                <p>PDF (up to 4MB)</p>
              </div>
              <div className="mt-5 space-y-5">
                {acceptedFiles &&
                  acceptedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200"
                    >
                      <div className="px-3 py-2 h-full grid place-items-center">
                        <File className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="px-3 py-2 h-full text-sm truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
              </div>
              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
              {/* determinate progress bar  */}
              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
