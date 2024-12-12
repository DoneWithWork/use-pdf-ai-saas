"use client";
import { trpc } from "@/app/_trpc/client";

import { File, Folder, Ghost, Loader2, Trash } from "lucide-react";
import React from "react";
import { format } from "date-fns";
import { File as FileTypes } from "@prisma/client";
import { Button } from "@/components/ui/button";
import byteSize from "byte-size";
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

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter, useSearchParams } from "next/navigation";
import UploadDocuments from "@/components/UploadDocuments";
import NewFolder from "@/components/NewFolder";
import { FileOrFolder } from "@/types/message";
import Loader from "@/components/Loader";
import { ErrorToast, SuccessToast } from "@/components/Toasts";

export default function Documents() {
  const utils = trpc.useUtils();
  const searchParams = useSearchParams();
  const page = +(searchParams.get("page") ?? 1);
  const router = useRouter();
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
  const { data, isLoading } = trpc.getUserDocumentPaginated.useQuery(
    {
      page: page < 1 ? 1 : page,
      totalItems: 5,
    },
    {
      retry: 3,
      retryDelay: 1000,
      refetchInterval: false,
    }
  );
  const documents: FileOrFolder[] =
    data?.files.map((file) => ({
      ...file,
      createdAt: new Date(file.createdAt),
      updatedAt: new Date(file.updatedAt),
    })) ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="w-full h-full flex flex-col wrapper">
      <div className="p-5 flex flex-row items-center justify-between flex-wrap">
        <h1 className="title">Documents</h1>
        <div className="flex flex-row gap-3 items-center">
          <NewFolder />
          <UploadDocuments />
        </div>
      </div>
      {/* Displa all files*/}
      <div className="px-4  max-w-full">
        <Table className="w-full overflow-x-scroll border-2 border-blue-200 rounded-xl">
          <TableCaption>
            {(documents?.length ?? 0) > 0 ? (
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        aria-disabled={page < 1}
                        className={`${page < 1 ? "fef" : "fefe"}`}
                        href={`?page=${page - 1}`}
                      />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationLink
                        key={i}
                        href={`?page=${i + 1}`}
                        isActive={i + 1 === page}
                      >
                        {i + 1}
                      </PaginationLink>
                    ))}
                  </PaginationItem>
                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={`?page=${page + 1}`} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            ) : isLoading ? (
              <div className="mt-16 flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <h3>Loading...</h3>
              </div>
            ) : (
              <div className="mt-16 flex flex-col items-center gap-2">
                <Ghost className="h-8 w-8 text-zinc-800" />
                <h3>Pretty Empty Around Here</h3>
              </div>
            )}
          </TableCaption>
          <TableHeader className="">
            <TableRow className="bg-blue-200  rounded-t-xl hover:bg-blue-100">
              <TableHead colSpan={4} className="w-[100px]">
                File/Folder Names
              </TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {documents.map((doc: FileOrFolder, index: number) => (
              <TableRow key={index}>
                <TableCell colSpan={4} className="font-medium">
                  <div
                    className={`${
                      "size" in doc ? "" : "cursor-pointer hover:underline "
                    } flex flex-row items-center gap-2 `}
                    onClick={() => {
                      if (!("size" in doc)) {
                        router.push("/dashboard/documents/folder/" + doc.id);
                      }
                    }}
                  >
                    {"size" in doc ? (
                      <File className="w-5 h-5" />
                    ) : (
                      "Files" in doc && <Folder className="w-5 h-5" />
                    )}
                    {doc.name}
                  </div>
                </TableCell>
                <TableCell>
                  {"size" in doc ? (
                    <div>{byteSize(doc.size).toString()}</div> // Assuming `size` exists only on File
                  ) : "Files" in doc ? (
                    <div>{(doc.Files as FileTypes[]).length} Files</div>
                  ) : (
                    <div>Folder</div>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(doc.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        onClick={() => {
                          checkDeletestatus({
                            id: doc.id,
                            isFolder: !("size" in doc),
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
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your {"size" in doc ? "file" : "folder"}
                          <span className="text-red-600  mt-4 text-lg font-semibold">
                            {" "}
                            {!isCheckingDeleteStatus ? (
                              deleteStatus?.canDelete ? (
                                "You can delete"
                              ) : (
                                `You can't delete this ${
                                  "size" in doc ? "file" : "folder"
                                }. ${
                                  "size" in doc
                                    ? "It has a workspace"
                                    : "It has files"
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
                          disabled={
                            isCheckingDeleteStatus || !deleteStatus?.canDelete
                          }
                          onClick={() => {
                            deleteSingleDoc({
                              id: doc.id,
                              isFolder: !("size" in doc),
                            });
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
