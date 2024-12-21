"use client";

import { getUserSubscriptionPlan } from "@/lib/stripe";

import { trpc } from "@/app/_trpc/client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ErrorToast } from "../mis/Toasts";
import Link from "next/link";

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
  paymentLink: string;
}

const BillingForm = ({ subscriptionPlan, paymentLink }: BillingFormProps) => {
  const { mutate: createStripeSession, isPending } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url;
        if (!url) {
          ErrorToast("Error creating stripe session");
        }
      },
    });

  return (
    <div className="max-w-5xl">
      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the{" "}
              <strong>
                {subscriptionPlan.isSubscribed ? subscriptionPlan.name : "Free"}
              </strong>{" "}
              plan.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit">
              {isPending ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}
              {subscriptionPlan.isSubscribed
                ? "Manage Subscription"
                : "Upgrade to PRO"}
            </Button>
            {subscriptionPlan.isSubscribed ? (
              <p className="rounded-full text-sm font-medium">
                {subscriptionPlan.isCanceled
                  ? "Your plan will be canceled on "
                  : "Your plan renews on "}
                <span className="font-semibold">
                  {format(
                    subscriptionPlan.stripeCurrentPeriodEnd!,
                    "dd.MM.yyyy"
                  )}
                </span>
                .
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default BillingForm;
