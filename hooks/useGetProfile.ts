// import { getProfile } from "@/lib/api/apiUser";
import { useQuery } from "@tanstack/react-query";

export const useGetProfile = () => {
  const {
    data: profileData,
    isLoading: isLoadoingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ["profile"],
    // queryFn: async () => await getProfile(),
  });

  return { profileData, isLoadoingProfile, profileError };
};
