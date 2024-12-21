import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { price } from "@/lib/config";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import UpgradeButton from "@/components/mis/UpgradeButton";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default async function Pricing() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  return (
    <div className="w-[95%] flex flex-col items-center mx-auto">
      <h1 className="heading mt-3 text-blue-500">Your Study Tool</h1>
      <p className="mt-2 description text-lg ">
        Gain new insights. Supercharge and <strong>10x</strong> your
        productivity.
      </p>

      <div className="w-full grid grid-cols-1 gap-14 lg:gap-4  xl:gap-2 sm:mt-4 md:mt-14  lg:grid-cols-3">
        <TooltipProvider>
          {price &&
            price.map((plan, index) => (
              <div
                key={index}
                className={cn(
                  plan.title === "PRO"
                    ? "bg-white border-2 h-[105%] border-blue-500"
                    : "bg-white mt-10",
                  "rounded-xl py-6 shadow-lg relative mx-2 sm:mx-5 "
                )}
              >
                {plan.title === "PRO" && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-white font-semibold text-sm text-center">
                    Upgrade Now
                  </div>
                )}
                <div className="flex flex-col items-center mb-5">
                  <p className="text-3xl my-2 font-semibold">{plan.title}</p>
                  <p className="description text-sm mt-2">{plan.description}</p>
                  <p className="my-7 font-semibold text-blue-600   text-5xl">
                    ${plan.price}
                  </p>
                  <p className="mt-2 description">Per Month</p>
                </div>
                <div className="border-t flex flex-col h-20 justify-center items-center border-b border-gray-200">
                  <div className="flex items-center space-x-1">
                    <p>{plan.quota} PDFs/mo included</p>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-zinc-500" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-2">
                        How many PDFs you can upload a month
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <ul className="my-10 space-y-4 px-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      {feature.negative ? (
                        <Minus className="h-4 w-4 text-red-500" />
                      ) : (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                      <div className="flex flex-row items-center gap-3">
                        <p>{feature.text}</p>
                        {feature.tooltip && (
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-2">
                              {feature.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div
                  className={cn(
                    plan.title === "PRO" ? "mt-20" : "mt-0",
                    "p-5 border-t   border-gray-200"
                  )}
                >
                  {plan.title === "PRO" && <UpgradeButton plan={plan.title} />}
                  {plan.title === "STUDENT" && (
                    <UpgradeButton plan={plan.title} />
                  )}
                  {plan.title === "FREE" && (
                    <Link
                      href={"/dashboard/billing"}
                      className={buttonVariants({
                        className: "w-full mx-auto ",
                        variant: "secondary",
                      })}
                    >
                      {user ? "Upgrade Now" : "Get Started"}
                      <ArrowRight className="h-5 w-5 ml-1.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
