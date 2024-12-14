"use client";
import React from "react";

import UpgradeButton from "../../components/mis/UpgradeButton";

export default function Pricing() {
  return (
    <div className="custom__container">
      <h1 className="heading">Pricing</h1>
      <p className="mt-2 description text-lg">
        We offer competitive pricing plans to suit your needs. Choose from our
        flexible options:
      </p>
      {/* - **Basic Plan**: $9.99/month - Ideal for individuals. - **Pro Plan**:
      $19.99/month - Perfect for small teams. - **Enterprise Plan**: Contact us
      for a custom quote - Best for large organizations. All plans come with a
      14-day free trial and 24/7 customer support. */}
      <UpgradeButton />
    </div>
  );
}
