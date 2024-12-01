import React, { Suspense } from "react";
import AuthCallBack from "../../components/AuthCallback";

export default function AuthCallBackpage() {
  return (
    <Suspense>
      <AuthCallBack />
    </Suspense>
  );
}
