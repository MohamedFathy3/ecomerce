import { getWalletDetails } from "@/lib/api/apiWallet";
import { wallet } from "@/types";
import { ShieldX } from "lucide-react";
import React from "react";

const Wallet = async () => {
  const walletDetailsResponse = await getWalletDetails();

  if (!walletDetailsResponse.success)
    return (
      <div className="bg-red-500/80 rounded-sm border border-red-500 px-4 py-2 text-white w-fit flex items-center gap-3">
        <ShieldX />
        فشل في تحميل تفاصيل المحفظة.
      </div>
    );

  const walletDetails = walletDetailsResponse.data as wallet;
  return (
    <div className="space-y-8 px-3">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">محفظتك</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg shadow-sm bg-teal-300/50">
            <h3 className="text-lg font-medium">الرصيد الحالي</h3>
            <p className="text-2xl font-bold mt-2">
              {walletDetails.wallet_balance}
            </p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium">النقاط المتوفرة</h3>
            <p className="text-2xl font-bold mt-2">
              {walletDetails.total_points}
            </p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium">النقاط المتاحة</h3>
            <p className="text-2xl font-bold mt-2">
              {walletDetails.available_points}
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <h3 className="text-lg font-medium">سجل المعاملات</h3>
          {walletDetails.point_transctions ? (
            <ul className="space-y-2">
              {walletDetails.point_transctions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="p-4 border rounded-lg shadow-sm"
                >
                  <p className="text-sm text-gray-500">
                    {transaction.created_at}
                  </p>
                  <p className="font-bold">{transaction.points} نقطة</p>
                  <p className="text-sm text-gray-500">
                    {transaction.description}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">لا توجد معاملات بعد.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
