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
        text: "10 questions per workspace",
        tooltip: "How many questions you can ask in a workspace",
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
    price: 10,
    quota: PLANS.find((plan) => plan.name === "Pro")?.quota || 2,
    description: "For the professionals",
    buttonText: "Get started",
    features: [
      {
        text: "100 Pages/PDF",
        tooltip: "How many pages you can have in a single PDF",
      },
      {
        text: "64MB PDF size",
        tooltip: "How big a PDF can be",
      },
      {
        text: "GPT-4o mini",
        tooltip: "Use the latest models from OpenAI",
      },
      {
        text: "Unlimited workspaces",
        tooltip: "Create as many workspaces as you want",
      },
      {
        text: "1000 questions per workspace",
        tooltip: "How many questions you can ask in a workspace",
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
        text: "50 Pages/PDF",
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
        text: "50 workspaces",
        tooltip: "Create maximum 50 workspaces",
      },
      {
        text: "100 questions per workspace",
        tooltip: "How many questions you can ask in a workspace",
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
