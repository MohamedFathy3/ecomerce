"use client";
import { ReactNode, useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { UserProfile } from "@/types";
import { getProfile, updateUserProfile } from "@/lib/api/apiUser";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validators";
import { toast } from "sonner";
import SpinnerMini from "@/components/custom/SpinnerMini";
import { delay } from "@/lib/utils";
import { useProfile } from "@/contexts/ProfileContext";
import { useRouter } from "next/navigation";
import ChangePassword from "@/components/custom/profile/changePassword";

const Profile = () => {
  const { profile, loading, refreshProfile, token } = useProfile();
  const [pendingProfile, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    // console.log("hhhhh");
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        email: profile.email || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(updateProfile);
  };

  async function updateProfile() {
    const profileData: UserProfile = {
      id: profile?.id ?? "", // Provide a fallback or get from session/profile
      name: getValues("name"),
      phone: getValues("phone"),
      email: getValues("email"),
      avatar: profile?.avatar,
    };

    // Call the API to update the profile
    const response = await updateUserProfile(token, profileData);
    if (response && response.success) {
      toast.success("The full active file has been updated.", {
        duration: 3000,
        description: "Changes were saved successfully.",
      });
      refreshProfile();
    } else {
      toast.error("Failed to update profile", {
        duration: 3000,
        description: response?.message || "An error occurred while updating the profile.",
      });
    }
  }

  useEffect(() => {
    router.refresh(); // Force refresh to rehydrate session
  }, [router]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-10 bg-gray-300 dark:bg-gray-700 rounded"
            />
          ))}
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded col-span-2" />
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-10 bg-gray-300 dark:bg-gray-700 rounded"
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
Account details
      </h1>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={onSubmit}
      >
        <div>
          <Label
            htmlFor="first-name"
            className="mb-1 block text-sm font-medium text-muted-foreground"
          >
            First Name *
          </Label>
          <Input
            id="first-name"
            {...register("name")}
            placeholder=" Name"
            type="text"
          />
          {errors.name && (
            <span className="text-red-500 text-xs">
              {errors.name.message}
            </span>
          )}
        </div>
       
        <div>
          <Label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-muted-foreground"
          >
            Phone Number *
          </Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="Phone Number"
            type="tel"
          />
          {errors.phone && (
            <span className="text-red-500 text-xs">{errors.phone.message}</span>
          )}
        </div>
        <div>
          <Label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-muted-foreground"
          >
Email *
          </Label>
          <Input
            id="email"
            {...register("email")}
            placeholder="Email"
            type="text"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>
       
        <div className="mt-8 flex justify-end md:col-span-2">
          <Button
            type="submit"
            // onClick={(e) => {
            //   e.preventDefault();
            //   console.log("Submitting profile data");
            //   handleSubmit(onSubmit);
            // }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <SpinnerMini /> : "save changes"}
          </Button>
        </div>
      </form>

      <hr className="my-8 border-muted" />

      <ChangePassword />
    </div>
  );
};

export default Profile;
