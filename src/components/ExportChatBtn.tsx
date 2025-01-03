"use client";
import React from "react";
import { Button } from "./ui/button";
import { trpc } from "@/app/_trpc/client";
import Loader from "./mis/Loader";

export default function ExportChatBtn({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const { isLoading, refetch } = trpc.exportChat.useQuery(
    {
      workspaceId,
    },
    {
      enabled: false, // Don't fetch automatically
    }
  );
  const downloadMessages = async () => {
    try {
      const result = await refetch(); // Fetch messages
      if (result.data) {
        // Convert data to JSON string
        const dataStr = JSON.stringify(result.data, null, 2);

        // Create a Blob and trigger download
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "messages.json";
        a.click();
        URL.revokeObjectURL(url);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };
  return (
    <Button
      id="secondtour-7"
      onClick={() => downloadMessages()}
      disabled={isLoading}
      className=""
    >
      <span className="text-sm md:text-base">
        {isLoading ? <Loader message="Exporting" /> : "Export chat"}
      </span>
    </Button>
  );
}
