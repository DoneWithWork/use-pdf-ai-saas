import { PLANS } from "@/config/stripe";
import { PricingType } from "@/types/types";

export const price: PricingType[] = [
  {
    title: "FREE",
    price: 0,
    quota: PLANS.find((plan) => plan.name === "Free")?.quota || 2,
    description: "Everyone starts here",
    buttonText: "Get started",
    features: [
      {
        text: "5 Pages/PDF",
        tooltip: "How many pages you can have in a single PDF",
      },
      {
        text: "4MB PDF size",
        tooltip: "How big a PDF can be",
      },
      {
        text: "GPT-4o mini",
        tooltip: "Use the GPT-4o mini model",
      },
      {
        text: "One workspace",
        tooltip: "Create maximum one workspace",
      },
      {
        text: "Priority Support",
        tooltip: "Get help when you need it",
        negative: true,
      },
    ],
    href: "/api/auth/login",
  },
  {
    title: "PRO",
    price: 14,
    quota: PLANS.find((plan) => plan.name === "Pro")?.quota || 2,
    description: "For the professionals",
    buttonText: "Get started",
    features: [
      {
        text: "100 Pages/PDF",
        tooltip: "How many pages you can have in a single PDF",
      },
      {
        text: "32MB PDF size",
        tooltip: "How big a PDF can be",
      },
      {
        text: "GPT-4o mini + GPT-4o",
        tooltip: "Use the latest models from OpenAI",
      },
      {
        text: "Unlimited workspaces",
        tooltip: "Create as many workspaces as you want",
      },
      {
        text: "Priority Support",
        tooltip: "Get help when you need it",
      },
    ],
    href: "/api/auth/login",
  },
  {
    title: "STUDENT",
    price: 5,
    quota: PLANS.find((plan) => plan.name === "Student")?.quota || 25,
    description: "For uni assignments and projects",
    buttonText: "Get started",
    features: [
      {
        text: "25 Pages/PDF",
        tooltip: "How many pages you can have in a single PDF",
      },
      {
        text: "16MB PDF size",
        tooltip: "How big a PDF can be",
      },
      {
        text: "GPT-4o mini",
        tooltip: "Use the GPT-4o mini model",
      },
      {
        text: "Maximum 50 workspaces",
        tooltip: "Create multiple workspaces",
      },
      {
        text: "Priority Support",
        tooltip: "Get help when you need it",
        negative: true,
      },
    ],
    href: "/api/auth/login",
  },
];
