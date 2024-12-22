"use client";
import { CloudLightningIcon, File, WorkflowIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

import Logo from "@/public/logo.png";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import UpgradeButton from "../mis/UpgradeButton";

const DashboardNav = ({
  children,
  subscription,
}: {
  children: React.ReactNode;
  subscription: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}) => {
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
          {!subscription?.isSubscribed && (
            <div className="w-full rounded-xl h-52 mx-auto bg-blue-400 px-3 py-4 text-white space-y-4">
              <div className="flex-row-custom">
                <p className="font-semibold text-xl text-nowrap">
                  Need more <span className="">power</span>?
                </p>
                <CloudLightningIcon className="text-yellow-300 w-8 h-8" />
              </div>

              <p className="text-lg text-center">
                Consider upgrading to{" "}
                <span className="font-bold text-2xl text-center w-full block">
                  PRO
                </span>
              </p>
              <UpgradeButton plan="PRO" />
            </div>
          )}
          {children}
        </div>
      </nav>
    </div>
  );
};

export default DashboardNav;
