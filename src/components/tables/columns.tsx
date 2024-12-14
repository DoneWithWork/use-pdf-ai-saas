"use client";
import { DocumentTypes, DocumentType } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import byteSize from "byte-size";
import { Button } from "../ui/button";
import { ArrowUpDown, Loader2, Trash } from "lucide-react";
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
import { ErrorToast, SuccessToast } from "../mis/Toasts";
import { trpc } from "@/app/_trpc/client";
import Loader from "../mis/Loader";
import Link from "next/link";

export const columns: ColumnDef<DocumentTypes>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      if (row.original.documentType === DocumentType.FOLDER) {
        return (
          <Link
            href={"/dashboard/documents/folder/" + row.original.id}
            className="cursor-pointer hover:underline "
          >
            {row.original.name}
          </Link>
        );
      } else {
        return <p>{row.original.name}</p>;
      }
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File/Folder Names
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size/Number of Files",
    cell: ({ row }) => {
      const document = row.original;
      return document.documentType === DocumentType.FOLDER
        ? `${document.number_of_files ?? 0} files`
        : `${byteSize(document.size) ?? 0}`;
    },
  },
  {
    accessorKey: "documentType",
    header: "Document Type",
  },
  {
    accessorKey: "createdAt",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateCreated = row.original;
      return <p>{new Date(dateCreated.createdAt).toDateString()}</p>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const isFolder = row.original.documentType === DocumentType.FOLDER;
      console.log(isFolder, id);
      const utils = trpc.useUtils();
      const { mutate: deleteSingleDoc, isPending: isDeletingSingleDoc } =
        trpc.deleteSingleFileOrFolder.useMutation({
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
                {!isFolder ? "file" : "folder"}
                <span className="text-red-600  mt-4 text-lg font-semibold">
                  {" "}
                  {!isCheckingDeleteStatus ? (
                    deleteStatus?.canDelete ? (
                      "You can delete"
                    ) : (
                      `You can't delete this ${
                        !isFolder ? "file" : "folder"
                      }. ${!isFolder ? "It has a workspace" : "It has files"}`
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
                  });
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
