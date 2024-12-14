"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { File, Menu, WorkflowIcon } from "lucide-react";
import Logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
export default function MobileSideBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  return (
    <Sheet>
      <SheetTrigger className="absolute top-4 left-4 block md:hidden">
        <Menu size={24} />
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-blue-300">
        <SheetHeader className="justify-between">
          <SheetTitle>
            <Link href={"/"} className="inline-block">
              <Image src={Logo} alt="Logo" width={150} height={100}></Image>
            </Link>
            <div className="mt-12 space-y-4">
              <Link
                href={"/dashboard/workspaces"}
                className={cn(
                  pathName === "/dashboard/workspaces" ? "bg-blue-400 " : "",
                  "icon_link text-black"
                )}
              >
                <WorkflowIcon size={20} />
                <span className="text-xl ">Workspaces</span>
              </Link>

              <Link
                href={"/dashboard/documents"}
                className={cn(
                  pathName === "/dashboard/documents" ? "bg-blue-400 " : "",
                  "icon_link text-black"
                )}
              >
                <File size={20} />
                <span className="text-xl ">Documents</span>
              </Link>
            </div>
          </SheetTitle>

          <div>{children}</div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
