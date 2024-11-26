"use client";
import { trpc } from "./_trpc/client";

import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function Home() {
  const getList = trpc.getList.useQuery();

  return (
    <>
      <h1>{JSON.stringify(getList.data)}</h1>

      <RegisterLink>Register</RegisterLink>
      <LoginLink>Login</LoginLink>
    </>
  );
}
