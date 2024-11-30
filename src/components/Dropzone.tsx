import { trpc } from "@/app/_trpc/client";
import { ErrorToast } from "@/app/components/Toasts";
import { useUploadThing } from "@/app/components/uploadthing";
import { Cloud, FileText } from "lucide-react";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Progress } from "./ui/progress";
import { shortenName } from "@/lib/utils";
import byteSize from "byte-size";
export const OurUploadDropzone = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const utils = trpc.useUtils();
  const { startUpload } = useUploadThing("documentUploader", {
    onBeforeUploadBegin: (files) => {
      const newFiles = files.map((file) => {
        const newFile = new File([file], file.name + "-" + Date.now(), {
          type: file.type,
        });
        setFiles((prevFiles) => [...prevFiles, newFile]);
        return newFile;
      });
      return newFiles;
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
    onUploadError: (error) => {
      ErrorToast(`Error uploading file: ${error.message}`);
      console.log("upload error");
    },
    onUploadProgress: (progress) => {
      console.log(progress);
      setProgress(progress);
    },
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      console.log(res);
      utils.getUserDocumentPaginated.invalidate();
    },
  });
  return (
    <div>
      <Dropzone
        multiple
        onDrop={async (acceptedFiles) => {
          await startUpload(acceptedFiles);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
          >
            <div className="flex items-center justify-center h-full w-full">
              <div className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex-center">
                  <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                  <p className="mb-2 text-sm text-zinc-700">
                    <span className="font-semibold">Click to Upload</span> or
                    drag and drop
                  </p>
                  <p>PDF (up to 4MB)</p>
                </div>

                <input
                  {...getInputProps()}
                  type="file"
                  id="dropzone-file"
                  className="hidden"
                />
                {/* determinate progress bar  */}
              </div>
            </div>
          </div>
        )}
      </Dropzone>
      {files.length > 0 &&
        files.map((file, index) => (
          <div
            key={index}
            className="w-full bg-blue-100 px-2 py-3 flex flex-row items-center gap-2"
          >
            <FileText size={50} className="w-10 h-10" />
            <div>
              <p className="text-ellipsis ">{shortenName(file, 30)}</p>
              <p>{byteSize(file.size).toString()}</p>
            </div>
          </div>
        ))}
      {isUploading && (
        <div>
          <Progress value={progress} className="h-1 w-full bg-zinc-200" />
        </div>
      )}
    </div>
  );
};