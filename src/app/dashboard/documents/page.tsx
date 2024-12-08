"use client";
import { trpc } from "@/app/_trpc/client";

import { Ghost, Loader2, Trash } from "lucide-react";
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

export default function Documents() {
  const [currentDeletingFile, setCurrentDeletingFile] = React.useState<
    string | null
  >(null);
  const utils = trpc.useUtils();
  const searchParams = useSearchParams();
  const page = +(searchParams.get("page") ?? 1);
  const router = useRouter();
  const {} = trpc.deleteDoc.useMutation({
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
  const { data, isLoading } = trpc.getUserDocumentPaginated.useQuery({
    page: page < 1 ? 1 : page,
    totalItems: 5,
  });
  const documents: FileOrFolder[] =
    data?.files.map((file) => ({
      ...file,
      createdAt: new Date(file.createdAt),
      updatedAt: new Date(file.updatedAt),
    })) ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="w-full h-full flex flex-col ">
      <div className="p-5 flex flex-row items-center justify-between">
        <h1 className="title">Documents</h1>
        <div className="flex flex-row gap-3 items-center">
          <NewFolder />
          <UploadDocuments />
        </div>
      </div>
      {/* Displa all files*/}
      <div className="px-4  max-w-full">
        <Table className="w-full overflow-x-scroll">
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
          <TableHeader>
            <TableRow className="bg-gray-200 hover:bg-gray-300">
              <TableHead colSpan={4} className="w-[100px]">
                File Name
              </TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {documents.map((doc: FileOrFolder, index: number) => (
              <TableRow
                key={index}
                className={`${"size" in doc ? "" : "cursor-pointer"}`}
                onClick={() => {
                  if (!("size" in doc)) {
                    router.push("/dashboard/documents/folder/" + doc.id);
                  }
                }}
              >
                <TableCell colSpan={4} className="font-medium">
                  {doc.name}
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
                        // onClick={() => deleteFile({ id: doc.id })}
                        size={"sm"}
                        variant={"destructive"}
                        className=""
                      >
                        {currentDeletingFile === doc.id ? (
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
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
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
