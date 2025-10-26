import { accountSEO } from "@/lib/seo";

export const metadata = accountSEO.orders;

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
