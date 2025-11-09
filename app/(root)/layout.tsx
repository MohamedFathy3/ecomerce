import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import CompareProvider from "@/contexts/CompareContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { getCartData } from "@/lib/api/apiCart";
import { auth } from "@/lib/auth";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  const session = await auth();
  if (session?.accessToken || session?.user?.token) {
    await queryClient.prefetchQuery({
      queryKey: ["cart"],
      queryFn: async () => getCartData(),
    });
  }
  return (
    <html lang="en">
      <body>
        {/* LanguageProvider لازم يكون في أعلى مستوى */}
        <LanguageProvider>
          <ReactQueryProvider>
            <CompareProvider>
              <HydrationBoundary state={dehydrate(queryClient)}>
                <Header />
                <main className="flex-1 ">{children}</main>
                <Footer />
              </HydrationBoundary>
            </CompareProvider>
          </ReactQueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}