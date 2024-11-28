import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
export default async function UserProfile() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="flex flex-row items-center gap-2">
      {user?.picture ? (
        <Image
          src={`${user.picture}`}
          width={36}
          height={36}
          alt="user profile image"
          className="w-9 h-9"
        />
      ) : (
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}
      <p className="font-semibold">{user?.given_name || user?.username}</p>
    </div>
  );
}
