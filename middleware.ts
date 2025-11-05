import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const session = await auth();
  
  // 1. أولاً: تحقق من المصادقة لل routes المحمية
  if (!session?.user && isProtectedRoute(req.nextUrl.pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 2. ثانياً: معالجة اللغة
  let language = req.cookies.get('Lan')?.value || 'en';
  
  // لو في language في query params (من الزر)، خزنه في cookies
  const langParam = req.nextUrl.searchParams.get('lang');
  if (langParam && ['en', 'nl', 'de', 'fr'].includes(langParam)) {
    language = langParam;
    
    // عدل الـ response علشان يضيف الـ cookie
    const response = NextResponse.redirect(req.nextUrl.pathname); // إعادة توجيه بدون query params
    response.cookies.set('Lan', language, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }
  
  // خلي اللغه متاحة في الـ headers
  const response = NextResponse.next();
  response.headers.set('x-language', language);
  
  return response;
}

// دالة علشان نتحقق من ال routes المحمية
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    "/account", 
    "/account/:path*", 
    "/favorites", 
    "/cart", 
    "/checkout"
  ];
  
  return protectedRoutes.some(route => {
    if (route.includes(':path*')) {
      const baseRoute = route.replace('/:path*', '');
      return pathname.startsWith(baseRoute);
    }
    return pathname === route;
  });
}

export const config = {
  matcher: [
    // كل ال paths
    "/((?!api|_next/static|_next/image|favicon.ico|images|vectors).*)",
  ],
};