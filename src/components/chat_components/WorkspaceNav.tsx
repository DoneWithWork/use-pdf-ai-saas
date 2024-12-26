import { MenuIcon } from "lucide-react";
import React, { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { ErrorToast } from "../mis/Toasts";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "../mis/Logo";

import WorkspaceNavOptions from "../WorkspaceNavOptions";
export default function WorkspaceNav({
  workspaceName = "",
  workspaceId,
}: {
  workspaceName: string;
  workspaceId: string;
}) {
  const [curName, setCurName] = useState(workspaceName);
  const [open, setOpen] = useState(false);

  const utils = trpc.useUtils();
  const { mutate: renameFile } = trpc.renameFile.useMutation({
    onSuccess: () => {
      utils.getOneWorkspace.invalidate();
    },
    onError: (error) => {
      return ErrorToast(`Error: ${error.message}`);
    },
    retry: 3,
    retryDelay: 3000,
  });
  const saveNewName = () => {
    renameFile({ newName: curName, workspaceId: workspaceId });
  };
  return (
    <nav className=" bg-white h-16 border-b-2 px-2  py-2 flex flex-row justify-between items-center ">
      <div className="flex-row-custom">
        <Logo link="/dashboard/workspaces" />
        <input
          type="text"
          placeholder={workspaceName}
          value={curName}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              if (curName === "") {
                setCurName("untitled document");
              }
              saveNewName();
              // Remove focus from the input
              event.currentTarget.blur();
            }
          }}
          onBlur={() => {
            if (curName === "") {
              setCurName("untitled document");
            }
            saveNewName();
          }}
          onFocus={(event) => {
            event.target.select(); // Select all text inside the input
          }}
          onChange={(event) => setCurName(event.target.value)}
          className="placeholder:text-lg placeholder:font-semibold px-2 py-1"
        />
      </div>

      <div className="hidden sm:flex flex-row items-center gap-10 ">
        <WorkspaceNavOptions workspaceId={workspaceId} />
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="sm:hidden">
          <MenuIcon size={25} className="cursor-pointer w-6 h-6" />
        </SheetTrigger>
        <SheetContent className="w-72">
          <SheetHeader>
            <SheetTitle>Options</SheetTitle>
            <WorkspaceNavOptions workspaceId={workspaceId} />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
