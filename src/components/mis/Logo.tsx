import Link from "next/link";
import LogoIcon from "@/public/logo.png";
import Image from "next/image";
export default function Logo() {
  return (
    <Link href={"/"} className="inline-block">
      <Image
        priority
        src={LogoIcon}
        alt="Logo"
        width={150}
        height={100}
      ></Image>
    </Link>
  );
}
