"use client";
import { PDFDocument } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import byteSize from "byte-size";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

import DeleteDocument from "../documents/folder/DeleteDocument";

export const documentColumns: ColumnDef<PDFDocument>[] = [
  {
    accessorKey: "name",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File Names
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const size = row.original.size;
      return <p>{`${byteSize(size) ?? 0}`}</p>;
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
      const isFolder = false;
      return <DeleteDocument id={id} isFolder={isFolder} />;
    },
  },
];
