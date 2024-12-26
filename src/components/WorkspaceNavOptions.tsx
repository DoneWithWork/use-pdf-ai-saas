import React from "react";
import ExportChatBtn from "./ExportChatBtn";

export default function WorkspaceNavOptions({
  workspaceId,
}: {
  workspaceId: string;
}) {
  return (
    <>
      <div className="py-5">
        <ExportChatBtn workspaceId={workspaceId} />
      </div>
    </>
  );
}
