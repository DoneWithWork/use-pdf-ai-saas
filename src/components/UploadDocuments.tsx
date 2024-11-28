"use client";

import { File } from "lucide-react";
import { Progress } from "./ui/progress";
import Dropzone from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";

export default function UploadDocuments() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return <div>UploadDocuments</div>;
}

const UploadDropzone = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing("pdfUploader");
  const utils = trpc.useUtils();
  const { mutate: newWorkspace } = trpc.newWorkspace.useMutation({
    onSuccess: (workspace) => {
      console.log("Workspace created successfully");
      // close the dialog
      //get the id and allow to upload files for the workspace
      utils.getWorkspaces.invalidate();
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Creating new Workspace...",
        variant: "default",
      });
      router.push(`/workspace/${workspace!.id}`);
      //create a new workspace and link file to it
    },
    retry: 3,
    retryDelay: 500,
  });
  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      console.log(file);
      //link the file to the workspace

      //close the dialog
      utils.getUserFiles.invalidate();
      newWorkspace({ fileId: file.id });
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
          toast({
            title: "Error",
            description: "Error uploading files",
            variant: "destructive",
          });
        }
        const fileResponse = res ? res[0] : null;
        const key = fileResponse?.key;
        if (!key) {
          toast({
            title: "Error",
            description: "Error uploading files",
            variant: "destructive",
          });
        }

        //check if its in the db
        //handle file uploading
        //clear interval
        clearInterval(progressInterval);
        setUploadProgress(100);
        if (key) {
          startPolling({ key });
        } else {
          toast({
            title: "Error",
            description: "Key is undefined",
            variant: "destructive",
          });
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
