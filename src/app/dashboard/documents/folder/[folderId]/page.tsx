import "server-only";
import IndividualFolder from "@/components/documents/folder/IndividualFolder";
import Loader from "@/components/mis/Loader";
import React, { Suspense } from "react";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  return (
    <div className="px-5 py-3">
      <Suspense fallback={<Loader message="Loading your folder" />}>
        <IndividualFolder folderId={(await params).folderId} />
      </Suspense>
    </div>
  );
}
