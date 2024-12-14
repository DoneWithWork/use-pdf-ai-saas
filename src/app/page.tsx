"use client";

import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import ImagePlaceholder from "../public/imagePlaceholder.png";
import LandingNav from "../components/navbars/LandingNav";
import Footer from "@/components/mis/Footer";

export default function Home() {
  // const getList = trpc.getList.useQuery();

  return (
    <div className="  h-full w-full">
      <LandingNav />
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
      <Footer />
    </div>
  );
}
