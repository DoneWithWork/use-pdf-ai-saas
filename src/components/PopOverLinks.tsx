import { CreditCard, MoonStar, User2 } from "lucide-react";
import React from "react";
import { Separator } from "./ui/separator";
import Link from "next/link";

const Links = [
  {
    name: "Account",
    link: "profile",
    icon: User2,
  },
  {
    name: "Billing",
    link: "billing",
    icon: CreditCard,
  },
];

export default function PopOverLinks() {
  return (
    <div className=" ">
      <Link href={`/pricing`}>
        <div className=" profile-link my-2 pl-3">
          <MoonStar size={20} />
          <p className="font-semibold">Upgrade </p>
        </div>
        <Separator />
      </Link>
      {Links.map((link, index) => (
        <Link href={`/dashboard/${link.link}`} key={index}>
          <div className=" profile-link pl-3">
            <link.icon size={20} className="" />
            <p className="font-semibold">{link.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
