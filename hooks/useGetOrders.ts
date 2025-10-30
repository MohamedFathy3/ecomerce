// import { getUserOrders } from "@/lib/api/apiOrders";
import { useQuery } from "@tanstack/react-query";

export const useGetOrders = () => {
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: errorOrders,
  } = useQuery({
    queryKey: ["orders"],
    // queryFn: async () => await getUserOrders(),
  });

  return { ordersData, isLoadingOrders, errorOrders };
};
