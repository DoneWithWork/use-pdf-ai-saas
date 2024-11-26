import { File, MessageCircle, WorkflowIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const DashboardNav = () => {
  return (
    <nav className="bg-blue-100 sm:w-20 md:w-36 lg:w-72 h-screen">
      <div className="px-5 py-3 flex flex-col h-screen justify-between">
        <div>
          <h1 className="font-semibold text-2xl hidden sm:block">ChatPdf</h1>
          <div className="space-y-6 mt-10">
            <Link
              href={"/dashboard/workspaces"}
              className="flex flex-row items-center gap-2"
            >
              <WorkflowIcon size={20} />
              <p className="text-xl hidden sm:block">Workspaces</p>
            </Link>
            <Link
              href={"/dashboard/chats"}
              className="flex flex-row items-center gap-2"
            >
              <MessageCircle size={20} />
              <p className="text-xl hidden sm:block">Chats</p>
            </Link>
            <Link
              href={"/dashboard/documents"}
              className="flex flex-row items-center gap-2"
            >
              <File size={20} />
              <p className="text-xl hidden sm:block">Documents</p>
            </Link>
          </div>
        </div>
        <div>
          <p className="hidden sm:block">Settings</p>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
