import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const delay = async (ms: number) =>
  await new Promise((res) => setTimeout(res, ms));

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places

export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

export const testCurrency = (value: string) =>
  /^\d+\.\d{2}$/.test(formatNumberWithDecimal(Number(value)));

// Format number as currency in EGP (Egyptian Pound)
export function formatCurrencyEGP(amount: number): string {
  const formatted = new Intl.NumberFormat("en-EG", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(amount);
  return `${formatted} LE`;
}

// Format number as currency in EGP (Egyptian Pound)
export function formatCurrency(
  amount: number,
  currency: string = "EGP"
): string {
  const formatted = new Intl.NumberFormat("en-EG", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${currency}`;
}
