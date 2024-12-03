import LandingNav from "@/components/LandingNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <>
      <LandingNav />
      <div className="max-w-[1200px] mx-auto flex flex-col items-center ">
        <h1 className="text-4xl font-bold text-center mt-20">404 Not Found</h1>
        <p className="text-center mt-5">
          The page you are looking for does not exist.
        </p>
        {/* Insert a meme here  */}
        <Link href={"/"} className="mt-5 ">
          <Button>
            <Home size={24} />
            <span className={cn("ml-2")}>Go Home</span>
          </Button>
        </Link>
      </div>
    </>
  );
}
