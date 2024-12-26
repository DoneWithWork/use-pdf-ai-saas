"use client";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import React from "react";
import { Button } from "./ui/button";

export default function CTA() {
  return (
    <div className="cta custom__container mt-32">
      <h1 className="heading">Get Started</h1>
      <p className="description my-4 text-xl">No credit card required</p>
      <Button asChild size={"lg"} className="mt-5">
        <RegisterLink className="font-semibold text-xl h-12">
          Start for Free
        </RegisterLink>
      </Button>
    </div>
  );
}
