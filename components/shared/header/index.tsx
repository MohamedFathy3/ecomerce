import HaederPages from "./headerPages";
import HeaderButtons from "./headerButtons";
import HeaderLogo from "./headerLogo";
import HeaderSearch from "./headerSearch";
import UserButton from "./userButton";
import HeaderMenu from "./headerMenu";
import { Categories } from "./categories";
import MobileNav from "./mobileNav";
import { auth } from "@/lib/auth";
import HeaderCart from "./headerCart";
import { getCartData } from "@/lib/api/apiCart";
import { category } from "@/types";
import { getAllCategories } from "@/lib/api/apiProducts";
import HeaderPages from "./headerPages";
import { User } from "@/types";

const Header = async () => {
  const session = await auth();
  const cart = await getCartData();
  const categories: category[] = await getAllCategories();
  let user = null;
  if (session?.user) {
    user = session.user;
  }
  return (
    <>
      <header className="border-b sticky top-0 start-0 end-0 bg-background z-50">
        <div className="wrapper">
          {/* تصميم للشاشات الصغيرة */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between py-3">
              {/* القائمة واللوجو */}
              <div className="flex items-center gap-2">
                <HeaderMenu session={session} />
                <HeaderLogo />
              </div>
              
              {/* أزرار المستخدم والعربة */}
              <div className="flex items-center gap-2">
                <HeaderButtons session={session}>
                  <HeaderCart session={session} />
                </HeaderButtons>
                <UserButton user={user as User} />
              </div>
            </div>
            
            {/* رسالة الترحيب للمستخدم */}
            {user && (
              <div className="text-center text-gray-600 text-sm dark:text-gray-300 pb-2">
                <span className="font-semibold">Welcome, </span>
                {user.firstName}
              </div>
            )}
            
            {/* شريط البحث */}
            <div className="pb-3">
              <HeaderSearch categories={categories} />
            </div>
          </div>

          {/* تصميم للشاشات المتوسطة والكبيرة */}
          <div className="hidden sm:!grid sm:grid-cols-4 sm:grid-rows-2 lg:!flex lg:flex-between lg:gap-2 lg:items-center">
            <div className="flex items-center gap-2 col-start-2 col-span-3 row-start-1 row-span-1">
              <HeaderLogo />
              {user ? (
                <div className="ms-auto lg:ms-0 lg:hidden text-gray-600 text-sm dark:text-gray-300">
                  <span className="font-semibold">Welcome,</span>
                  {user.firstName} 
                </div>
              ) : null}
            </div>
            <HeaderPages />
            <div className="row-start-2 row-span-1 col-span-full">
              <HeaderSearch categories={categories} />
            </div>
            <HeaderButtons session={session}>
              <HeaderCart session={session} />
            </HeaderButtons>
            <UserButton user={user as User} />
            <div className="col-start-1 col-span-1">
              <HeaderMenu session={session} />
            </div>
            <MobileNav />
          </div>
        </div>
      </header>
      <Categories />
    </>
  );
};

export default Header;