"use client";
import { File, WorkflowIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

import Logo from "@/public/logo.png";
import Image from "next/image";
import { cn } from "@/lib/utils";

const DashboardNav = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  return (
    <div>
      <nav className="bg-blue-200 w-64 h-screen hidden md:block">
        <div className="px-2 py-3 flex flex-col h-screen justify-between">
          <div>
            <div className="flex flex-col items-center  mt-5">
              <Link href={"/"}>
                <Image src={Logo} alt="Logo" width={150} height={100}></Image>
              </Link>
            </div>
            <div className="space-y-6 mt-10">
              <Link
                href={"/dashboard/workspaces"}
                className={cn(
                  pathName === "/dashboard/workspaces"
                    ? "bg-blue-400 text-gray-100"
                    : "",
                  "icon_link"
                )}
              >
                <WorkflowIcon size={20} />
                <p className="text-xl hidden sm:block">Workspaces</p>
              </Link>

              <Link
                href={"/dashboard/documents"}
                className={cn(
                  pathName === "/dashboard/documents"
                    ? "bg-blue-400 text-gray-100"
                    : "",
                  "icon_link"
                )}
              >
                <File size={20} />
                <p className="text-xl hidden sm:block">Documents</p>
              </Link>
            </div>
          </div>
          {children}
        </div>
      </nav>
    </div>
  );
};

export default DashboardNav;
