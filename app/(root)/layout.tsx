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
        <ReactQueryProvider>
          <div className="flex min-h-screen flex-col relative">
            {/* LanguageProvider لازم يكون في أعلى level */}
            <LanguageProvider>
              <CompareProvider>
                <HydrationBoundary state={dehydrate(queryClient)}>
                  <Header />
                  <main className="flex-1 ">{children}</main>
                </HydrationBoundary>
                <Footer />
              </CompareProvider>
            </LanguageProvider>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}