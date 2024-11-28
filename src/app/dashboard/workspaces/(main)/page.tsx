"use client";
import { trpc } from "@/app/_trpc/client";
import UploadButton from "@/app/components/UploadButton";
import NewChat from "@/components/NewChat";
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
    <div className="w-full flex flex-col h-screen ">
      <div className="px-8 py-6 flex flex-row w-full justify-between items-center">
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
            className="w-full bg-gray-100 px-5 py-2 rounded-md m-5 block"
          >
            {workspace.name}
          </Link>
        ))}
        {isLoading && <Skeleton height={100} className="my-2" count={3} />}
      </div>
    </div>
  );
}
