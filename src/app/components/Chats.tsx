"use client";
import React from "react";
import { trpc } from "../_trpc/client";

export default function GetChats() {
  const { data: chats } = trpc.getChats.useQuery();

  return <div>{JSON.stringify(chats)}</div>;
}
