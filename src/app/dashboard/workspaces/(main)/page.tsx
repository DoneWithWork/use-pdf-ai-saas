"use client";
import { trpc } from "@/app/_trpc/client";
import NewChat from "@/components/chat_components/NewChat";
import { DataTable } from "@/components/tables/data-table";
import { workspaceColumns } from "@/components/tables/WorkspaceColumns";
import { ConvertStringToDates } from "@/lib/utils";

import React from "react";

export default function Workspaces() {
  const { data: workspaces, isLoading } = trpc.getWorkspaces.useQuery(
    undefined,
    {
      retryDelay: 1000,
      refetchInterval: false,
    }
  );
  const formattedWorkspaces = workspaces
    ? ConvertStringToDates(workspaces)
    : [];
  return (
    <div className="w-full flex flex-col h-screen wrapper">
      <div className="px-2 py-6 flex flex-row w-full justify-between items-center flex-wrap">
        <div className="space-y-1">
          <h1 className="title">Conversations</h1>
          <p className="description">Chat with your documents </p>
        </div>

        <NewChat />
      </div>
      <div className="overflow-auto overflow-x-hidden flex-1">
        {isLoading ? (
          <DataTable
            columns={workspaceColumns}
            data={[]}
            isLoading={isLoading}
          />
        ) : (
          <DataTable columns={workspaceColumns} data={formattedWorkspaces} />
        )}
      </div>
    </div>
  );
}
