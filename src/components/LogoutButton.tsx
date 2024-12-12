import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
export default function LogoutButton() {
  return (
    <Button variant={"destructive"} asChild>
      <LogoutLink className="flex flex-rwo items-center gap-2">
        <LogOut className="" size={22} />
        <span className="text-lg font-semibold">Logout</span>
      </LogoutLink>
    </Button>
  );
}
