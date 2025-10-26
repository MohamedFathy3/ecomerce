import { getNotifications } from "@/lib/api/apiNotifications";
import { useQuery } from "@tanstack/react-query";

export const useGetNotifications = () => {
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    error: notificationsError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => await getNotifications(),
  });

  return { notificationsData, isLoadingNotifications, notificationsError };
};
