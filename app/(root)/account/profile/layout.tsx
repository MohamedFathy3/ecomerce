import { accountSEO } from "@/lib/seo";

export const metadata = accountSEO.profile;

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
