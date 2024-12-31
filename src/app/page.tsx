"use client";

import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import dashboard from "../public/dashboard.png";

import workspace from "../public/workspace.png";
import folder from "../public/folder.png";
import Footer from "@/components/mis/Footer";

import LandingNav from "@/components/navbars/LandingNav";
import Link from "next/link";

export default function Home() {
  // const getList = trpc.getList.useQuery();

  return (
    <div className="  h-full w-full ">
      <LandingNav />

      <div className="custom__container h-screen flex flex-col justify-center -translate-y-20 sm:-translate-y-10 md:translate-y-0">
        <Link
          href="https://www.producthunt.com/posts/use-pdf-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-use&#0045;pdf&#0045;ai"
          target="_blank"
          className="mb-3"
        >
          <Image
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=743413&theme=light"
            alt="Use&#0032;PDF&#0032;AI - Smart&#0032;Answers&#0032;from&#0032;Your&#0032;PDFs&#0044;&#0032;Simplified&#0032;and&#0032;Instant | Product Hunt"
            style={{ width: "250px", height: "54px" }}
            width="250"
            height="54"
          />
        </Link>
        <h1 className="heading" id="tour1-step2">
          Smart Answers from Your PDFs, Simplified and{" "}
          <span className="text-primary font-extrabold underline">Instant</span>
        </h1>
        <p className="heading__description">
          Get instant answers from your PDFs with AI-driven chat. Upload, ask,
          and discover insights effortlessly.
        </p>
        <Image
          src={dashboard}
          alt="image"
          width={1000}
          height={1300}
          className="aspect-video mt-4 "
        />
      </div>
      <div className="custom__container mt-32">
        <h1 className="heading">Gain Important Insights</h1>
        <p className="heading__description">
          Have a chat with multiple documents all at once. Ask questions, get
          precise answers, and uncover insights seamlessly
        </p>
        <Image
          src={workspace}
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
          src={workspace}
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
          src={folder}
          alt="image"
          width={1000}
          height={1200}
          className="aspect-video mt-4"
        />
      </div>
      {/* <div className="custom__container mt-32">
        <h1 className="heading">The Tool You Need</h1>
        <p className="heading__description">
          Easily manage and organize all your documents—eliminate clutter and
          enhance productivity with a seamless document library.
        </p>
        <Image
          src={landing}
          alt="image"
          width={1000}
          height={1200}
          className="aspect-video mt-4"
        />
      </div> */}
      <div className="cta custom__container my-32">
        <h1 className="heading">
          Are you ready to increase your productivity?
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
