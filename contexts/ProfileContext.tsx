"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useTransition,
} from "react";
import { UserProfile } from "@/types";
import { getProfile, updateUserProfile } from "@/lib/api/apiUser";
import { useSession } from "next-auth/react";

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => void;
  token: string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const loadProfile = async () => {
    const result = await getProfile(
      session?.user?.token || session?.accessToken || ""
    );
    if (result?.success) {
      setProfile(result.data as UserProfile);
    }
    setLoading(false);
  };

  //   const updateProfile = async (profileData: UserProfile) => {
  //     await updateUserProfile(
  //       session?.user?.token || session?.accessToken || "",
  //       profileData
  //     );
  //   };

  function refreshProfile() {
    if (status === "authenticated") {
      startTransition(loadProfile);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      startTransition(loadProfile);
      setLoading(false);
    }
  }, [status]);
const updateProfile = async (profileData: Partial<UserProfile>) => {
  const token = session?.user?.token || session?.accessToken || "";
  if (!token) {
    console.error("No token available for profile update");
    return;
  }

  const result = await updateUserProfile(token, profileData);
  if (result?.success) {
    setProfile(result.data as UserProfile);
    return result;
  }
  return result;
};
  return (
    <ProfileContext.Provider
      value={{
        profile: profile as UserProfile,
        loading,
        refreshProfile,
        token: session?.user?.token || session?.accessToken || "",
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
