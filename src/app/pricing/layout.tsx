import React from "react";
import LandingNav from "../../components/navbars/LandingNav";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full">
      <LandingNav />
      {children}
    </div>
  );
}
