import { CloudLightningIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Logo from "../public/logo.svg";
import Image from "next/image";
export default function WorkspaceNav({
  workspaceName,
}: {
  workspaceName: string;
}) {
  return (
    <nav className=" bg-white h-16 border-b-2 px-2 flex flex-row justify-between items-center ">
      <div className="flex-row-custom">
        <Link href="/dashboard/workspace" className="block">
          <Image src={Logo} alt="logo" className="w-32 h-auto" />
        </Link>
        <input
          type="text"
          placeholder={workspaceName}
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
