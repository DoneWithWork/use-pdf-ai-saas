import { CloudLightningIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Logo from "../public/logo.png";
import Image from "next/image";
import { trpc } from "@/app/_trpc/client";
import { ErrorToast } from "./Toasts";
export default function WorkspaceNav({
  workspaceName = "",
  workspaceId,
}: {
  workspaceName: string;
  workspaceId: string;
}) {
  const [curName, setCurName] = useState(workspaceName);
  const utils = trpc.useUtils();
  const { mutate: renameFile } = trpc.renameFile.useMutation({
    onSuccess: () => {
      utils.getOneWorkspace.invalidate();
      console.log("Success");
    },
    onError: (error) => {
      console.log(error);
      return ErrorToast(`Error: ${error.message}`);
    },
    retry: 3,
    retryDelay: 3000,
  });
  const saveNewName = () => {
    renameFile({ newName: curName, workspaceId: workspaceId });
  };
  return (
    <nav className=" bg-white h-16 border-b-2 px-2 flex flex-row justify-between items-center ">
      <div className="flex-row-custom">
        <Link href="/dashboard/workspaces" className="block">
          <Image src={Logo} alt="logo" className="w-32 h-auto" />
        </Link>
        <input
          type="text"
          placeholder={workspaceName}
          value={curName}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              saveNewName();
            }
          }}
          onBlur={() => {
            saveNewName();
          }}
          onFocus={(event) => {
            event.target.select(); // Select all text inside the input
          }}
          onChange={(event) => setCurName(event.target.value)}
          className="placeholder:text-lg placeholder:font-semibold px-2 py-1"
        />
      </div>
      <div>
        <Link
          href={""}
          className="font-semibold text-blue-500 flex-row-custom gap-2"
        >
          <CloudLightningIcon size={25} className="" />
          <span>Upgrade</span>
        </Link>
      </div>
    </nav>
  );
}
