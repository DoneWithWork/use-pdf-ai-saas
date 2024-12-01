import { clsx, type ClassValue } from "clsx";
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
