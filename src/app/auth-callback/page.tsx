import "server-only";
import React, { Suspense } from "react";
import db from "../../../prisma/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import AuthCallBack from "@/components/auth/AuthCallback";

export default async function AuthCallBackpage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (user) {
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });
    console.log("dbUser", dbUser);
    if (dbUser) {
      redirect("/dashboard/workspaces");
    }
  }
  return (
    <Suspense>
      <AuthCallBack />
    </Suspense>
  );
}
