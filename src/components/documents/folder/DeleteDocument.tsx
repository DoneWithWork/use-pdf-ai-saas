"use client";
import { trpc } from "@/app/_trpc/client";
import Loader from "@/components/mis/Loader";
import { ErrorToast, SuccessToast } from "@/components/mis/Toasts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";

type Props = {
  id: string;
  isFolder: boolean;
  isWorkspace?: boolean;
};
export default function DeleteDocument({
  id,
  isFolder,
  isWorkspace = false,
}: Props) {
  const utils = trpc.useUtils();
  const { mutate: deleteSingleDoc, isPending: isDeletingSingleDoc } =
    trpc.deleteSingleFileFolderOrWorkspace.useMutation({
      retry: 3,
      retryDelay: 1000,

      onSuccess: () => {
        SuccessToast("Successfully deleted file/folder");
        utils.getUserDocumentPaginated.invalidate();
        utils.getUserFiles.invalidate();
      },
      onError: (error) => {
        ErrorToast(error.message);
      },
    });
  const {
    mutate: checkDeletestatus,
    isPending: isCheckingDeleteStatus,
    data: deleteStatus,
  } = trpc.queryDeleteDoc.useMutation({
    retry: 3,
    retryDelay: 1000,
    onError: (error) => {
      ErrorToast(error.message);
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => {
            checkDeletestatus({
              id,
              isFolder,
              isWorkspace,
            });
          }}
          size={"sm"}
          variant={"destructive"}
          className=""
        >
          {isDeletingSingleDoc ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="w-4 h-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            {isFolder ? "folder" : isWorkspace ? "workspace" : "file"}
            .
            <br />
            <span className="text-red-600  mt-4 text-lg font-semibold">
              {!isCheckingDeleteStatus ? (
                deleteStatus?.canDelete ? (
                  "You can delete"
                ) : (
                  `You can't delete this ${
                    isWorkspace ? "workspace" : isFolder ? "folder" : "file"
                  }. ${
                    isWorkspace
                      ? "It has associated data"
                      : isFolder
                      ? "It has files"
                      : "It has a workspace"
                  }`
                )
              ) : (
                <Loader message="Checking delete status" />
              )}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            disabled={isCheckingDeleteStatus || !deleteStatus?.canDelete}
            onClick={() => {
              deleteSingleDoc({
                id,
                isFolder,
                isWorkspace,
              });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
