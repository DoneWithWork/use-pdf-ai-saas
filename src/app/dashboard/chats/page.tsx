import GetChats from "@/app/components/Chats";
import NewChatDialog from "@/app/components/NewChatDialog";

import React from "react";

export default function Chats() {
  return (
    <div>
      <h1 className="title">Chats</h1>
      <div>
        <NewChatDialog />
      </div>
      <GetChats />
    </div>
  );
}
