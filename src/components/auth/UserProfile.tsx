import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronsUpDown } from "lucide-react";
import { shortenName } from "@/lib/utils";
import PopOverLinks from "../navbars/PopOverLinks";

export default async function UserProfile() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <Popover>
      <PopoverTrigger className="w-full  hover:bg-blue-400 transition-all rounded-xl">
        <div
          className="flex flex-row justify-between items-center mx-2 my-1 "
          id="firstTour-5"
        >
          <div className="flex flex-row items-center gap-2">
            {user?.picture ? (
              <Image
                src={`${user.picture}`}
                width={36}
                height={36}
                alt="user profile image"
                className="h-9 w-9 rounded-full border-2 border-gray-300"
              />
            ) : (
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <p className="important_text text-lg">
              {shortenName(user?.given_name || "", 15)}
            </p>
          </div>
          <ChevronsUpDown size={20} className="w-5 h-5" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        asChild
        className="w-40 p-0 m-0 "
        align="end"
        hideWhenDetached
        alignOffset={1}
      >
        <PopOverLinks />
      </PopoverContent>
    </Popover>
  );
}
