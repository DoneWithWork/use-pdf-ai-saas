"use client";
import LogoutButton from "@/components/mis/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { trpc } from "@/app/_trpc/client";
import { ErrorToast, SuccessToast } from "@/components/mis/Toasts";
import { useRouter } from "next/navigation";
import Loader from "@/components/mis/Loader";
import { Input } from "@/components/ui/input";
export default function ProfilePage() {
  const router = useRouter();
  const [canDelete, setCanDelete] = useState(false);
  const { user } = useKindeBrowserClient();
  const { mutate: deleteUser, isPending: isDeleting } =
    trpc.deleteUser.useMutation({
      retry: 3,
      retryDelay: 1000,
      onSuccess: () => {
        SuccessToast("Successfully deleted your account");

        router.push("/api/auth/logout");
        return;
      },
      onError: (error) => {
        ErrorToast(error.message);
      },
    });
  return (
    <div className="wrapper">
      <h1 className="title mt-4">My Account</h1>
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
            <p className="important_text ">{user?.given_name}</p>
            <p className="">{user?.email}</p>
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
      <div className=" py-2 mt-4 border-2 border-red-500 rounded-md px-4">
        <p className="text-2xl my-5 text-red-700 font-semibold">
          Delete Your Account
        </p>
        {isDeleting ? (
          <Loader message="Deleting your account..." />
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} aria-label="Delete User">
                Delete Your account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-semibold">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-lg">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers. If any
                  billings/subscriptions are active they will be cancelled and
                  not refunded.
                  <Input
                    className="mt-3 border-red-500 border-2 focus:border-red-600"
                    type="text"
                    onChange={(e) => {
                      if (e.target.value === "DELETE") {
                        setCanDelete(true);
                      } else {
                        setCanDelete(false);
                      }
                    }}
                    placeholder="Type 'DELETE' to confirm"
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  asChild
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Button
                    variant={"destructive"}
                    onClick={() => deleteUser()}
                    disabled={isDeleting || !canDelete}
                  >
                    Delete Account
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
