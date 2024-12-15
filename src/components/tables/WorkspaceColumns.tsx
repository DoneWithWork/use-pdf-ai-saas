"use client";
import { WorkspaceType } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

import DeleteDocument from "../documents/folder/DeleteDocument";

export const workspaceColumns: ColumnDef<WorkspaceType>[] = [
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
    accessorKey: "files",
    header: "Number Of Files",
    cell: ({ row }) => {
      const files = row.original.Files;
      return <p>{files.length}</p>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const isFolder = false;
      const isWorkspace = true;
      return (
        <DeleteDocument id={id} isFolder={isFolder} isWorkspace={isWorkspace} />
      );
    },
  },
];
