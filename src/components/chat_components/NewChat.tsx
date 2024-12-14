import { useDisclosure } from "@mantine/hooks";
import { Drawer } from "@mantine/core";
import { FileText, Loader2, Plus } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { cn, shortenName } from "@/lib/utils";
import byteSize from "byte-size";
import { useState } from "react";
import { File } from "@prisma/client";
import { ErrorToast } from "@/components/mis/Toasts";
import { useRouter } from "next/navigation";
import { SuccessToast } from "@/components/mis/Toasts";
import { Button } from "../ui/button";
import UploadDocuments from "../documents/UploadDocuments";
export default function NewChat() {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { data: files, isLoading } = trpc.getUserFiles.useQuery(undefined, {
    retry: 3,
    retryDelay: 1000,
  });
  const { mutate } = trpc.createNewChat.useMutation({
    onSuccess: (res) => {
      console.log("Chat created successfully");
      SuccessToast("Chat created successfully");
      router.push(`/workspace/${res.id}`);
    },
    onError: (err) => {
      ErrorToast(`Error creating chat: ${err.message}`);
      console.log("Error creating chat", err);
    },
  });

  const createChat = () => {
    const ids = selectedFiles.map((f) => f.id);
    setIsCreating(true);
    // Pass the `ids` to the mutation
    mutate({ ids });
    setIsCreating(false);
  };

  const selectFile = (file: File) => {
    if (selectedFiles.some((f) => f.id === file.id)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  return (
    <>
      <Drawer.Root
        opened={opened}
        size={"75%"}
        style={{ width: "100%" }}
        position="bottom"
        onClose={close}
      >
        <Drawer.Overlay />

        <Drawer.Content style={{ width: "", margin: "" }}>
          <div className="px-2 py-2 w-full relative">
            <p className="text-center font-semibold text-4xl">New Chat</p>
            <Drawer.CloseButton
              style={{ position: "absolute", top: 0, right: 0 }}
              m={10}
            />
          </div>
          <Drawer.Body>
            <UploadDocuments />
            <div className="w-full px-2 grid grid-cols-3  gap-4 mt-4 rounded-md ">
              {isLoading && <Loader2 className="animate-spin" size={25} />}
              {files?.map((file, index) => (
                <div
                  key={index}
                  className={cn(
                    selectedFiles.some((f) => f.id === file.id)
                      ? "isSelectedFile"
                      : "",
                    "selectFile"
                  )}
                  onClick={() =>
                    selectFile({
                      ...file,
                      createdAt: new Date(file.createdAt),
                      updatedAt: new Date(file.updatedAt),
                    })
                  }
                >
                  <FileText size={50} className="w-10 h-10" />
                  <div>
                    <p className="text-ellipsis ">
                      {shortenName(file.name, 20)}
                    </p>
                    <p>{byteSize(file.size).toString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full">
              <Button
                disabled={selectedFiles.length === 0 || isCreating}
                onClick={() => createChat()}
              >
                Create Chat
              </Button>
            </div>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      <Button onClick={open} className="mt-4 sm:mt-0">
        <div className="flex flex-row gap-1 items-center">
          <Plus size={25} />
          <span>New Chat</span>
        </div>
      </Button>
    </>
  );
}
