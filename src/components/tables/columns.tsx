"use client";
import { DocumentTypes, DocumentType } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import byteSize from "byte-size";

import { ArrowUpDown, Eye, File, Folder } from "lucide-react";

import Link from "next/link";
import DeleteDocument from "../documents/folder/DeleteDocument";
import { Button } from "../ui/button";

export const columns: ColumnDef<DocumentTypes>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      if (row.original.documentType === DocumentType.FOLDER) {
        return (
          <div className="flex-row-custom-2">
            <Folder size={20} className="text-blue-500" />
            <Link
              href={"/dashboard/documents/folder/" + row.original.id}
              className="cursor-pointer hover:underline "
            >
              {row.original.name}
            </Link>
          </div>
        );
      } else {
        return (
          <div className="flex-row-custom-2">
            <File size={20} className="text-blue-600" />
            <p>{row.original.name}</p>
          </div>
        );
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
      if (isFolder) {
        return (
          <div className="flex-row-custom ">
            <DeleteDocument id={id} isFolder={isFolder} />
            <Link
              href={"/dashboard/documents/folder/" + id}
              aria-label="View Folder"
            >
              <Button size={"sm"} className="bg-green-400 hover:bg-green-500">
                <Eye size={20} className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        );
      }
      return (
        <div className="flex-row-custom ">
          <DeleteDocument id={id} isFolder={isFolder} />
        </div>
      );
    },
  },
];
