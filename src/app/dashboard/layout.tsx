import React, { Suspense } from "react";
import DashboardNav from "../../components/DashboardNav";

import MobileSideBar from "@/components/MobileSideBar";
import Loader from "@/components/Loader";
import UserProfile from "@/components/UserProfile";
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
      <div className=" w-full bg-white overflow-x-auto">
        <Suspense fallback={<Loader message="Loading..." />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
