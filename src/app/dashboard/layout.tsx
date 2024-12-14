import React from "react";
import DashboardNav from "../../components/navbars/DashboardNav";

import MobileSideBar from "@/components/navbars/MobileSideBar";

import UserProfile from "@/components/auth/UserProfile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //upload files to workspace
  return (
    <div className="w-full flex flex-row h-screen  relative">
      <DashboardNav>
        <UserProfile />
      </DashboardNav>
      <MobileSideBar>
        <UserProfile />
      </MobileSideBar>
      <div className=" w-full bg-white overflow-x-auto">{children}</div>
    </div>
  );
}
