import { accountSEO } from "@/lib/seo";

export const metadata = accountSEO.favorites;

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
