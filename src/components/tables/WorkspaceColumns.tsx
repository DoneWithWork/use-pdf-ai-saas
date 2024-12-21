"use client";
import { WorkspaceType } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { ArrowUpDown, Eye } from "lucide-react";

import DeleteDocument from "../documents/folder/DeleteDocument";
import Link from "next/link";

export const workspaceColumns: ColumnDef<WorkspaceType>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <Link
          className="hover:underline"
          href={"/workspace/" + row.original.id}
        >
          {row.original.name}
        </Link>
      );
    },
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
        <div className="flex-row-custom  ">
          <DeleteDocument
            id={id}
            isFolder={isFolder}
            isWorkspace={isWorkspace}
          />
          <Link href={"/workspace/" + id} aria-label="View Folder">
            <Button size={"sm"} className="bg-green-400 hover:bg-green-500">
              <Eye size={20} className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
