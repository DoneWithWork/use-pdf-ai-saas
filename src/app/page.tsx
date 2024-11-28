"use client";
import { AppShell, Navbar, Header } from "@mantine/core";

import { trpc } from "./_trpc/client";

import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import Logo from "../public/logo.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ImagePlaceholder from "../public/imagePlaceholder.png";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
export default function Home() {
  // const getList = trpc.getList.useQuery();
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (current) => {
    if (current > 130) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  return (
    <div className="  h-full w-full">
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
          isHidden
            ? "rounded-xl shadow-md bg-gray-100"
            : "w-full bg-transparent",
          "z-10 flex flex-row items-center justify-between px-3 sm:px-5 md:px-10 rounded-xl"
        )}
      >
        <div>
          <Image
            src={Logo}
            alt="logo"
            width={160}
            height={100}
            className="aspect-video"
          />
        </div>
        <div className="space-x-10 hidden sm:block">
          <Link href={"/pricing"} className="font-semibold hover:underline">
            Pricing
          </Link>
          <Link href={"/use-cases"} className="font-semibold hover:underline">
            Use Cases
          </Link>
          <Button asChild size={"sm"}>
            <RegisterLink>Get Started</RegisterLink>
          </Button>
        </div>
        <div className="flex flex-row items-center gap-4 sm:hidden">
          <Button asChild size={"sm"}>
            <RegisterLink>Get Started</RegisterLink>
          </Button>
          <Menu size={24} />
        </div>
      </motion.nav>
      <div className="custom__container h-screen flex flex-col justify-center -translate-y-20 sm:-translate-y-10 md:translate-y-0">
        <h1 className="heading">
          Smart Answers from Your PDFs, Simplified and{" "}
          <span className="text-primary font-extrabold underline">Instant</span>
        </h1>
        <p className="heading__description">
          Get instant answers from your PDFs with AI-driven chat. Upload, ask,
          and discover insights effortlessly.
        </p>
        <Image
          src={ImagePlaceholder}
          alt="image"
          width={1000}
          height={1300}
          className="aspect-video mt-4"
        />
      </div>
      <div className="custom__container mt-32">
        <h1 className="heading">Gain Important Insights</h1>
        <p className="heading__description">
          Have a chat with multiple documents all at once. Ask questions, get
          precise answers, and uncover insights seamlessly
        </p>
        <Image
          src={ImagePlaceholder}
          alt="image"
          width={1000}
          height={1200}
          className="aspect-video mt-4"
        />
      </div>
      <div className="custom__container mt-32">
        <h1 className="heading">Clear concise Summaries</h1>
        <p className="heading__description">
          Have a chat with multiple documents all at once. Ask questions, get
          precise answers, and uncover insights seamlessly
        </p>
        <Image
          src={ImagePlaceholder}
          alt="image"
          width={1000}
          height={1200}
          className="aspect-video mt-4"
        />
      </div>
      <div className="custom__container mt-32">
        <h1 className="heading">Organised and Well Maintained</h1>
        <p className="heading__description">
          Easily manage and organize all your documents—eliminate clutter and
          enhance productivity with a seamless document library.
        </p>
        <Image
          src={ImagePlaceholder}
          alt="image"
          width={1000}
          height={1200}
          className="aspect-video mt-4"
        />
      </div>
      <div className="custom__container mt-32">
        <h1 className="heading">The Tool You Need</h1>
        <p className="heading__description">
          Easily manage and organize all your documents—eliminate clutter and
          enhance productivity with a seamless document library.
        </p>
        <Image
          src={ImagePlaceholder}
          alt="image"
          width={1000}
          height={1200}
          className="aspect-video mt-4"
        />
      </div>
      <div className="cta custom__container mt-32">
        <h1 className="heading">
          Make your academic and professional life easier with PDF AI
        </h1>
        <Button asChild size={"lg"} className="mt-5">
          <RegisterLink className="font-semibold text-xl h-12">
            Start for Free
          </RegisterLink>
        </Button>
      </div>
      <footer className="w-full h-32 bg-blue-100 mt-5">
        <div>
          <p>PDF AI</p>
          <p>
            PDF AI is your goto tool for getting instant answers from your PDFs
          </p>
        </div>
      </footer>
    </div>
  );
}
