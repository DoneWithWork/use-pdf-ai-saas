import { Loader2 } from "lucide-react";
import React from "react";

export default function Loader({ message }: { message: string }) {
  return (
    <span className="flex flex-row items-center gap-3">
      <span>{message}</span>
      <Loader2 className=" h-6 w-6 animate-spin" />
    </span>
  );
}
