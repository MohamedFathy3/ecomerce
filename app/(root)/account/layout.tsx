import AccountNav from "@/components/custom/account/accountNav";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ReactNode } from "react";

const AccountLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section className=" bg-muted dark:bg-background text-foreground sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 wrapper  relative">
        <ProfileProvider>
          <AccountNav />
          <main className="col-span-1 lg:col-span-3 bg-white dark:bg-muted/50 py-4 sm:p-8 rounded-sm shadow-sm">
            {children}
          </main>
        </ProfileProvider>
      </div>
    </section>
  );
};

export default AccountLayout;
