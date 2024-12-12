import LogoutButton from "@/components/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { shortenName } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import React from "react";

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <div className="wrapper">
      <h1 className="title">My Account</h1>
      <div className="mt-4 md:mt-10">
        <p className="important_paragraph_text">Personal Details</p>
        <Separator />
        <div className="flex flex-row items-center gap-2 my-4">
          {user?.picture ? (
            <Image
              src={`${user.picture}`}
              width={36}
              height={36}
              alt="user profile image"
              className="w-20 h-20 border-2 border-blue-300 rounded-full"
            />
          ) : (
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
          <div>
            <p className="important_text ">{user.given_name}</p>
            <p className="">{user.email}</p>
          </div>
        </div>
      </div>
      {/* <div>
        <p className="important_paragraph_text">Plans</p>
        <Separator />
      </div> */}
      <div className="mt-4">
        <LogoutButton />
      </div>
    </div>
  );
}
