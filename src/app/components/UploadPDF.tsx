"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Cloud, File, MessageSquarePlus } from "lucide-react";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { useUploadThing } from "./uploadthing";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "../_trpc/client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { ErrorToast, SuccessToast } from "./Toasts";

export default function UploadPDF() {
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
          <p className="font-semibold text-sm">New Document</p>
        </Button>
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <UploadDropzone setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
type uploadingFile = {
  name: string;
  isUploading: boolean;
  progress: number;
};
const UploadDropzone = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing("documentUploader");
  const [num_of_files, setNumOfFiles] = useState<number>(0);
  const utils = trpc.useUtils();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      console.log(file);
      //link the file to the workspace

      //close the dialog
      utils.getUserDocumentPaginated.invalidate();

      setIsOpen(false);
      SuccessToast("File uploaded successfully");
    },
    retry: true,
    retryDelay: 500,
  });
  const startSimulatedProgress = (targetIndex: number) => {
    setUploadingFiles((prev) =>
      prev.map((file, index) => {
        if (index === targetIndex) {
          // Start with 0 progress for the specific file
          let newProgress = file.progress;
          const interval = setInterval(() => {
            if (newProgress >= 95) {
              clearInterval(interval);
            }
            newProgress += 5;
            // Update the state immutably
            setUploadingFiles((prevState) =>
              prevState.map((file, i) =>
                i === targetIndex ? { ...file, progress: newProgress } : file
              )
            );
          }, 500);
          return { ...file, progress: newProgress }; // Set initial progress for this file
        }
        return file;
      })
    );
  };
  return (
    <Dropzone
      multiple
      onDrop={async (acceptedFiles) => {
        await startUpload(acceptedFiles);
        setIsOpen(false);
        SuccessToast("Files uploaded successfully");
        utils.getUserDocumentPaginated.invalidate();
        // const uploadFiles = async () => {
        //   try {
        //     await Promise.all(
        //       acceptedFiles.map(async (file, index) => {
        //         const response = await startUpload([file]);

        //         if (!response) {
        //           throw new Error(`Upload failed for file at index ${index}`);
        //         }

        //         setUploadingFiles((prev) => [
        //           ...prev,
        //           {
        //             name: response[0].name,
        //             progress: 0,
        //             isUploading: true,
        //             id: index,
        //           },
        //         ]);

        //         const progressInterval = startSimulatedProgress(
        //           uploadingFiles[index]
        //         );

        //         const key = response[0]?.key;
        //         if (!key) {
        //           throw new Error(
        //             `Key is undefined for file at index ${index}`
        //           );
        //         }

        //         // Update progress to 100 immediately after file upload is successful
        //         setUploadingFiles((prev) =>
        //           prev.map((file, i) =>
        //             i === index ? { ...file, progress: 100 } : file
        //           )
        //         );

        //         // Start polling once upload is complete
        //         startPolling({ key });

        //         // Resolve this file's upload process
        //         return true;
        //       })
        //     );

        //     // Optionally, you can notify the user of success here
        //   } catch (error) {
        //     console.error(error);
        //     // Notify user about the error
        //     ErrorToast("Error uploading files");
        //   } finally {
        //     console.log("Upload process complete.");
        //   }
        // };
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
              {/* {uploadingFiles.length > 0
                ? uploadingFiles.map((file, index) => (
                    <div className="w-full mt-4 max-w-xs mx-auto" key={index}>
                      <Progress
                        value={file.progress}
                        className="h-1 w-full bg-zinc-200"
                      />
                    </div>
                  ))
                : null} */}
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
