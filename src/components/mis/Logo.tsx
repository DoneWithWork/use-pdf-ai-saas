import Link from "next/link";
import LogoIcon from "@/public/logo.png";
import Image from "next/image";
export default function Logo({ link = "/" }: { link?: string }) {
  return (
    <Link href={link} className="inline-block">
      <Image
        priority
        src={LogoIcon}
        alt="Logo"
        className=""
        width={150}
        height={100}
      ></Image>
    </Link>
  );
}
