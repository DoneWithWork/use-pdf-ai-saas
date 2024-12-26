import CTA from "@/components/CTA";
import Footer from "@/components/mis/Footer";
import LandingNav from "@/components/navbars/LandingNav";
import {
  Book,
  CircleDollarSign,
  Image,
  Notebook,
  Receipt,
  UserSearch,
} from "lucide-react";
import React from "react";

const usecases = [
  {
    name: "Reports",
    color: "bg-green-200",
    iconColor: "text-green-600",
    description: "Analyze and summarize reports",
    icon: Notebook,
  },
  {
    name: "Invoices",
    color: "bg-yellow-200",
    iconColor: "text-yellow-600",
    description: "Extract data from invoices",
    icon: Receipt,
  },
  {
    name: "Research Papers",
    color: "bg-blue-200",
    iconColor: "text-blue-600",
    description: "Gain insights from research papers",
    icon: UserSearch,
  },
  {
    name: "Contracts",
    color: "bg-purple-200",
    iconColor: "text-purple-600",
    description: "Review and analyze contracts",
    icon: CircleDollarSign,
  },
  {
    name: "Manuals",
    color: "bg-orange-200",
    iconColor: "text-orange-600",
    description: "Extract information from manuals",
    icon: Book,
  },
  {
    name: "Presentations",
    color: "bg-pink-200",
    iconColor: "text-pink-600",
    description: "Summarize key points from presentations",
    icon: Image,
  },
] as const;

export default function UseCases() {
  return (
    <div className="w-full h-full">
      <LandingNav />
      <div className="w-[90%] mx-auto">
        <h1 className="title text-center text-4xl my-5">
          Gain insights from your PDFs
        </h1>
        <p className="text-center description text-xl">
          Save time and stress by using this tool
        </p>
        <div className=" mt-10  max-w-[70%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {usecases.map((usecase, index) => (
            <div
              key={index}
              className="rounded-xl shadow-lg bg-blue-200 h-52 px-4 py-4"
            >
              <div className={`${usecase.color} inline-block rounded-lg`}>
                <usecase.icon className={`${usecase.iconColor} h-7 w-7 m-2`} />
              </div>
              <p className="font-medium text-xl">{usecase.name}</p>
            </div>
          ))}
        </div>
      </div>
      <CTA />
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
