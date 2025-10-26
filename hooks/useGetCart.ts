import { getCartData } from "@/lib/api/apiCart";
import { useQuery } from "@tanstack/react-query";

export function useGetCart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => await getCartData(),
  });
  return { data, isLoading, error };
}
