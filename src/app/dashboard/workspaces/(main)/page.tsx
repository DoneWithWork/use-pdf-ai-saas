"use client";
import { trpc } from "@/app/_trpc/client";
import NewChat from "@/components/chat/NewChat";
import Link from "next/link";
import React from "react";
import Skeleton from "react-loading-skeleton";

export default function Workspaces() {
  const { data: workspaces, isLoading } = trpc.getWorkspaces.useQuery(
    undefined,
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

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
        {workspaces?.map((workspace) => (
          <Link
            href={`/workspace/${workspace.id}`}
            key={workspace.id}
            className="w-full bg-gray-100 px-5 py-2 rounded-md m-2 block"
          >
            {workspace.name}
          </Link>
        ))}
        {isLoading && <Skeleton height={100} className="my-2" count={3} />}
      </div>
    </div>
  );
}
