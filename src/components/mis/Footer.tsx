import React from "react";
import Logo from "./Logo";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";

const links = [
  {
    name: "Twitter",
    icon: Twitter,
    link: "https://x.com/PdfAi66942",
  },
  {
    name: "Github",
    icon: Github,
    link: "https://github.com/DoneWithWork/use-pdf-ai-saas",
  },
] as const;
const productLinks = [
  {
    name: "Use Cases",
    link: "/use-cases",
  },
  {
    name: "Pricing",
    link: "/pricing",
  },
  {
    name: "FAQ",
    link: "/faq",
  },
] as const;
const companyLinks = [
  {
    name: "Legal",
    link: "/legal",
  },
  // { later we add this
  //   name: "Use PDF AI vs ChatPDF",
  //   link: "/compare/chatpdf-alternative",
  // },
] as const;
export default function Footer() {
  return (
    <footer className=" h-full bg-blue-100 mt-5 px-10 py-10">
      <hr className="border-2 border-white mb-10" />
      <div className="flex flex-col xl:flex-row ">
        <div className="mr-5">
          <Logo />
          <p className="w-[50ch]  text-gray-500">
            Get instant answers from your PDFs with AI-driven chat. Upload, ask,
            and discover insights effortlessly.
          </p>
          <div className="mt-5 flex flex-row items-center gap-5 ">
            {links.map((link) => (
              <Link href={link.link} key={link.name}>
                <link.icon className="ml-2 w-7 h-7 text-gray-500 font-semibold  " />
              </Link>
            ))}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <h3 className="font-semibold text-black">Product</h3>
            <div className="mt-3 flex flex-col gap-5">
              {productLinks.map((link) => (
                <Link href={link.link} key={link.name}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-black">Company</h3>
            <div className="mt-3 flex flex-col gap-5">
              {companyLinks.map((link) => (
                <Link href={link.link} key={link.name}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
