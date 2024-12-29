"use client";
import { cn } from "@/lib/utils";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { Menu } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";

import { useState } from "react";
import Logo from "../mis/Logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
export default function LandingNav() {
  const [isHidden, setIsHidden] = useState(false);
  const { isAuthenticated } = useKindeBrowserClient();
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (current) => {
    if (current > 130) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });
  return (
    <motion.nav
      variants={{
        hidden: {
          position: "sticky",

          backgroundColor: "rgb(243 244 246 / var(--tw-bg-opacity, 1))",

          margin: "0 auto",
          top: 0,
          left: 0,
          y: "10%",
          width: "80%",
        },
        visible: {
          y: "0%",
          width: "100%",
          backgroundColor: "transparent",
        },
      }}
      transition={{ duration: 0.2 }}
      animate={isHidden ? "hidden" : "visible"}
      initial={{ y: -100 }}
      className={cn(
        isHidden ? "rounded-xl shadow-md bg-gray-100" : "w-full bg-transparent",
        "z-10 flex flex-row items-center justify-between px-3 sm:px-5 md:px-10 rounded-xl py-3 flex-wrap"
      )}
    >
      <div>
        <Logo />
      </div>
      <div className="space-x-10 hidden sm:block">
        <Link href={"/pricing"} className="font-semibold hover:underline">
          Pricing
        </Link>
        <Link href={"/use-cases"} className="font-semibold hover:underline">
          Use Cases
        </Link>
        {isAuthenticated ? (
          <Link href={"/dashboard/workspaces"}>
            <Button>Dashboard</Button>
          </Link>
        ) : (
          <Button asChild size={"sm"}>
            <RegisterLink>Get Started</RegisterLink>
          </Button>
        )}
      </div>
      <div className="flex flex-row items-center gap-4 sm:hidden">
        {isAuthenticated ? (
          <Link href={"/dashboard/workspaces"}>
            <Button>Dashboard</Button>
          </Link>
        ) : (
          <Button asChild size={"sm"}>
            <RegisterLink>Get Started</RegisterLink>
          </Button>
        )}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="sm:hidden z-10">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent className="">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
              <div className="flex flex-col space-y-5">
                <Button asChild>
                  <Link
                    href={"/pricing"}
                    className="font-semibold hover:underline"
                  >
                    Pricing
                  </Link>
                </Button>
                <Button asChild>
                  <Link
                    href={"/use-cases"}
                    className="font-semibold hover:underline"
                  >
                    Use Cases
                  </Link>
                </Button>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
}
