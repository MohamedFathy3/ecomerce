import { accountSEO } from "@/lib/seo";

export const metadata = accountSEO.addresses;

export default function AddressesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
