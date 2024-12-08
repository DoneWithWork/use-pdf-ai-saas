import { Loader2 } from "lucide-react";
import React from "react";

export default function Loader({ message }: { message: string }) {
  return (
    <div>
      <p>{message}</p>
      <Loader2 className="my-24 h-6 w-6 animate-spin" />;
    </div>
  );
}
