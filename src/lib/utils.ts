import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const enumStatus = (status: string | null) => {
  switch (status) {
    case "completed":
      return "Terminé";
    case "ongoing":
      return "En cours";
    default:
      return "Inconnu";
  }
};
