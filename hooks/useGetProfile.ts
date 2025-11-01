// hooks/useGetProfile.ts
import { getProfile } from "@/lib/api/apiUser";
import { useQuery } from "@tanstack/react-query";

export function useGetProfile() {
  // جيب الـ token من localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || "";
    }
    return "";
  };

  const {
    data: profile,
    isLoading: isLoadoingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", getToken()], // أضف الـ token في queryKey
    queryFn: () => getProfile(getToken()),
    enabled: !!getToken(), // تشغل الـ query فقط إذا فيه token
  });

  return {
    profile,
    isLoadoingProfile,
    profileError,
  };
}