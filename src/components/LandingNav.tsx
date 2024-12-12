"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { Menu } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";

import { useState } from "react";
export default function LandingNav() {
  const [isHidden, setIsHidden] = useState(false);
  const { isAuthenticated } = useKindeBrowserClient();
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
        "z-10 flex flex-row items-center justify-between px-3 sm:px-5 md:px-10 rounded-xl py-3"
      )}
    >
      <div>
        <Link href={"/"}>
          <Image src={Logo} alt="logo" width={160} height={100} />
        </Link>
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
        <Button asChild size={"sm"}>
          <RegisterLink>Get Started</RegisterLink>
        </Button>
        <Menu size={24} />
      </div>
    </motion.nav>
  );
}
