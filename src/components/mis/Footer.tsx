import React from "react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="w-full h-32 bg-blue-100 mt-5">
      <div>
        <Logo />
        <p>
          PDF AI is your goto tool for getting instant answers from your PDFs
        </p>
      </div>
    </footer>
  );
}
