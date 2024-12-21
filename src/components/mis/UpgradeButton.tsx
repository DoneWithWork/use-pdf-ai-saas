"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "../../app/_trpc/client";
import { ArrowRight } from "lucide-react";
export default function UpgradeButton({ plan }: { plan: "PRO" | "STUDENT" }) {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    },
  });
  return (
    <Button
      onClick={() => createStripeSession({ planName: plan })}
      className="w-full group"
      variant={`${plan === "PRO" ? "default" : "secondary"}`}
    >
      Upgrade Now
      <ArrowRight className="h-5 w-5 ml-1.5 group-hover:ml-3 transition-all " />
    </Button>
  );
}
