import React, { Suspense } from "react";
import DashboardNav from "../../components/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //upload files to workspace
  return (
    <div className="w-full flex flex-row h-screen overflow-hidden">
      <DashboardNav />
      <div className="flex-1 bg-white">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
}
