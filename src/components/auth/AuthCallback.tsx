"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { trpc } from "@/app/_trpc/client";

export default function AuthCallBack() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");

  const { data, error } = trpc.authCallback.useQuery(undefined, {
    retry: 3,
    retryDelay: 1000,
  });

  // Use useEffect to check for errors and redirect if unauthorized
  useEffect(() => {
    if (error?.data?.httpStatus === 401) {
      console.log("unauthorized");

      router.push("/");
    }

    if (data?.success) {
      router.push(
        origin
          ? `/dashboard/workspaces?origin=${origin}`
          : "/dashboard/workspaces"
      );
    }
  }, [error, data, origin, router]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
}
