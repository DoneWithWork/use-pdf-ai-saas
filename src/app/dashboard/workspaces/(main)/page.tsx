"use client";
import { trpc } from "@/app/_trpc/client";
import UploadButton from "@/app/components/UploadButton";
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
    <div>
      <h1 className="title">Workspaces</h1>
      <div className="my-5">
        <UploadButton />
      </div>
      <div>
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
