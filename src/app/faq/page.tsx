"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/mis/Footer";
import LandingNav from "@/components/navbars/LandingNav";
import CTA from "@/components/CTA";

const faq = [
  {
    title: "What exactly is PDF AI?",
    content:
      "PDF AI is an AI-powered tool that allows you to chat with your PDFs, extract insights, summarize documents, and generate citations. It's designed for researchers, students, and professionals who need accurate, efficient, and affordable document analysis.",
  },
  {
    title: "How does PDF AI work?",
    content:
      "Simply upload your PDF documents, and our AI processes them to generate summaries, answer your questions, and provide references. It uses Langchain and OpenAi to analyze your documents and provide accurate insights. Find the code on GitHub.",
  },
  {
    title: "Can I upload multiple documents at once?",
    content:
      "Yes, on all Plans this is allowed. You can upload multiple documents and interact with them simultaneously.",
  },
  {
    title: "How fast are the responses?",
    content:
      "Response times depend on the document size and query complexity. For most tasks, results are provided within seconds.",
  },
  {
    title: "I’m experiencing slow response times. What should I do?",
    content:
      "Slow responses could be due to large documents or high server demand. Ensure a stable internet connection and try again. If the issue persists, contact support.",
  },
  {
    title: "The AI is providing inaccurate results. What can I do?",
    content:
      "You can refine your query for better accuracy. If inaccuracies persist, report the issue to our support team for further assistance.",
  },
];
export default function FAQ() {
  return (
    <div className="h-full w-full">
      <LandingNav />
      <div className="max-w-[90%] mx-auto h-screen">
        <h1 className="title text-center text-4xl my-5">FAQ</h1>
        <Accordion type="single" collapsible>
          {faq &&
            faq.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
        <CTA />
      </div>

      <Footer />
    </div>
  );
}
