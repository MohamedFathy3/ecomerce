import { getCartData } from "@/lib/api/apiCart";
import { getWalletDetails } from "@/lib/api/apiWallet";
import { useQuery } from "@tanstack/react-query";

export function useGetWallet() {
  const {
    data: walletDetails,
    isLoading: isLoadingWallet,
    error: errorWallet,
  } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => await getWalletDetails(),
  });
  return { walletDetails, isLoadingWallet, errorWallet };
}
