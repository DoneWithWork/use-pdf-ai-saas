import { File, WorkflowIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import UserProfile from "./UserProfile";
import Logo from "@/public/logo.svg";
import Image from "next/image";
const DashboardNav = async () => {
  return (
    <div>
      <nav className="block sm:hidden">{/* <h1>Hi</h1> */}</nav>
      <nav className="bg-blue-200 lg:w-64 h-screen hidden sm:block">
        <div className="px-2 py-3 flex flex-col h-screen justify-between">
          <div>
            <div className="flex flex-col items-center  mt-5">
              <Link href={"/"}>
                {" "}
                <Image src={Logo} alt="Logo" width={150} height={100}></Image>
              </Link>
            </div>
            <div className="space-y-6 mt-10">
              <Link href={"/dashboard/workspaces"} className="icon_link">
                <WorkflowIcon size={20} />
                <p className="text-xl hidden sm:block">Workspaces</p>
              </Link>

              <Link href={"/dashboard/documents"} className="icon_link">
                <File size={20} />
                <p className="text-xl hidden sm:block">Documents</p>
              </Link>
            </div>
            {/* <Link
              href={"/dashboard/settings"}
              className="flex flex-row items-center gap-2"
            >
              <Settings size={20} />
              <p className="text-xl hidden sm:block">Settings</p>
            </Link> */}
          </div>

          <UserProfile />
        </div>
      </nav>
    </div>
  );
};

export default DashboardNav;
