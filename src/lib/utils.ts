import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenFileName(file: File, maxLength: number) {
  const name = file.name;

  const extension = file.type.split("/").pop();
  if (name.length > maxLength) {
    return name.slice(0, maxLength - 3) + "..." + extension;
  }
  return name;
}
export function shortenName(file: string, maxLength: number) {
  const name = file;
  const extension = file.split(".").pop();
  if (name.length > maxLength) {
    return name.slice(0, maxLength - 3) + "..." + extension;
  }
  return name;
}
export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function ConvertStringToDates<T extends { createdAt: string }>(
  data: Array<T>
): Array<Omit<T, "createdAt"> & { createdAt: Date }> {
  return data.map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
  }));
}
export function capitalizeFirstLetter(plan: string) {
  return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
}
export function constructMetadata({
  title = "UsePdfAi - the Saas for everyone",
  description = "Get instant answers from your PDFs with AI-driven chat.",
  image = "./icon.png",
  icons = "./favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,

    openGraph: {
      title,
      description,
      siteName: "UsePdfAi",
      url: "https://usepdfai.com",

      images: [
        {
          url: image,

          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,

      description,
      images: [image],
      creator: "@usepdfai",
    },
    icons,

    metadataBase: new URL("https://usepdfai.com"),

    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
