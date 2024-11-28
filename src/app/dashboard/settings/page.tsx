import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
export default async function Settings() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <div>
      <h1 className="title">Settings</h1>
      <p>Manage and secure your account</p>
      <div className="container space-y-3">
        <div>
          <p></p>
        </div>
      </div>
    </div>
  );
}
