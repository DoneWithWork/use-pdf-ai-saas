import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenName(file: File, maxLength: number) {
  const name = file.name;

  const extension = file.type.split("/").pop();
  if (name.length > maxLength) {
    return name.slice(0, maxLength - 3) + "..." + extension;
  }
  return name;
}
