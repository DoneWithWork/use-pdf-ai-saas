import React from "react";
import DashboardNav from "../components/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //upload files to workspace
  return (
    <div className="w-full flex flex-row">
      <DashboardNav />
      <div className="px-10 py-10 flex-1">{children}</div>
    </div>
  );
}
