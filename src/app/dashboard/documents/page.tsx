"use client";
import { trpc } from "@/app/_trpc/client";

import React from "react";

import UploadDocuments from "@/components/documents/UploadDocuments";
import NewFolder from "@/components/documents/folder/NewFolder";
import { DocumentTypes } from "@/types/types";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "@/components/tables/columns";

export default function Documents() {
  const { data, isLoading } = trpc.getUserDocumentPaginated.useQuery(
    undefined,
    {
      retry: 3,
      retryDelay: 1000,
      refetchInterval: false,
    }
  );
  const documents: DocumentTypes[] =
    data?.files.map((file) => ({
      ...file,
      createdAt: new Date(file.createdAt),
    })) ?? [];

  return (
    <div className="w-full h-full flex flex-col wrapper">
      <div className="p-5 flex flex-row items-center justify-between flex-wrap">
        <h1 className="title">Documents</h1>

        <div className="flex flex-row gap-3 items-center">
          <NewFolder />
          <UploadDocuments />
        </div>
      </div>
      <DataTable columns={columns} data={documents} isLoading={isLoading} />
    </div>
  );
}
