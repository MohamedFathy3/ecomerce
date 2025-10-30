"use server";

import {
  DoctorRegisterFormData,
  RegisterFormData,
  ShippingMethod,
  SignInFormData,
  UpdateUserPasswordData,
  UserAddress,
  UserProfile,
} from "@/types";
import { api } from "../axios";
import { AxiosError } from "axios";
import { signInSchema } from "../validators";
import { auth, signIn, signOut } from "../auth";
import { delay } from "../utils";
import { redirect } from "next/navigation";
import { getAuthToken } from "./helpers";

export async function registerUser(data: RegisterFormData) {
  try {
    const response = await api.post("front/register", data);
    console.log('register', response.data)
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('Axios error:', error.response?.data);
      
      // إذا كان في validation errors
      if (error.response?.data?.errors) {
        return {
          status: "error",
          payload: error.response.data.errors,
        };
      }
      
      // إذا كان في message عادية
      if (error.response?.data?.message) {
        return {
          status: "error",
          payload: { message: error.response.data.message },
        };
      }
      
      // إذا كان في أي response تانيه
      return {
        status: "error",
        payload: error.response?.data || "An unknown error occurred",
      };
    } else {
      console.log("Unexpected error during registration:", error);
      return {
        status: "error",
        payload: "An unexpected error occurred",
      };
    }
  }
}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export async function registerDoctor(data: any) {
//   try {
//     const response = await api.post("front/register-doctor", data);
//     console.log('doctor register', response.data)
//     return response.data.data;
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       return {
//         status: "error",
//         payload: error.response?.data?.errors || error.response?.data?.message || "An error occurred",
//       };
//     }
//     return {
//       status: "error",
//       payload: "An unexpected error occurred",
//     };
//   }
// }


// Sign in the user with credentials
// Sign in the user with credentials
export async function signInWithCredentials(formData: SignInFormData) {
  try {
    console.log('📧 Sign in attempt with:', { email: formData.email });
    
    const user = signInSchema.parse({
      email: formData.email,
      password: formData.password,
    });
    
    console.log('🔐 Calling signIn...');
    const result = await signIn("credentials", {
      ...user,
      redirect: false,
    });

    console.log('📋 SignIn result:', result);

    if (result?.error) {
      console.log('❌ SignIn error:', result.error);
      return {
        success: false,
        payload: result.error,
      };
    }

    console.log('✅ SignIn successful');
    return {
      success: true,
      message: "Sign in successful",
    };
  } catch (error) {
    console.log("❌ Sign in error:", error);
    return {
      success: false,
      payload: "An unexpected error occurred",
    };
  }
}
export async function signOutUser(token: string) {
  try {
    const response = await api.post(
      "logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Sign out response:", response.data);

    // Redirect to the sign-in page after successful sign-out
  } catch (error) {
    console.error("Error during sign-out:", error);
  }
}

export const getProfile = async (userToken: string) => {
  try {
    console.log("👤 Fetching user profile...");
    
    const response = await api.get("/front/check-auth", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    console.log("✅ Profile response:", response.data);

    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Profile retrieved successfully"
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to retrieve profile",
      data: null
    };

  } catch (error) {
    console.error("❌ Get profile error:", error);
    
    if (error instanceof AxiosError) {
      console.error("🔍 Axios error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data
      });

      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Unauthorized access - Please login again",
          data: null,
          notAuthenticated: true
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: null
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
      data: null
    };
  }
};
// في apiUser.ts
export const updateUserProfile = async (
  userToken: string,
  profileData: Partial<UserProfile>
) => {
  try {
    console.log("👤 Updating user profile:", profileData);
    
    const response = await api.post(
      "/front/update-profile",
      profileData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("✅ Update profile response:", response.data);

    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Profile updated successfully"
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to update profile",
      data: null
    };

  } catch (error) {
    console.error("❌ Update profile error:", error);
    
    if (error instanceof AxiosError) {
      console.error("🔍 Axios error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data
      });

      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Unauthorized access - Please login again",
          data: null,
          notAuthenticated: true
        };
      }

      if (error.response?.status === 422) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat().join(", ");
        return {
          success: false,
          message: `Validation failed: ${errorMessages}`,
          errors: validationErrors,
          data: null
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: null
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
      data: null
    };
  }
};

export async function updateUserPassword(
  data: UpdateUserPasswordData,
  userToken?: string
) {
  try {
    const authResult = await getAuthToken(userToken);
    if (!authResult.success) {
      return { success: false, message: authResult.message };
    }
    const token = authResult.token;
    const response = await api.put(
      "user-update-password",
      {
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.data as UserProfile,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to update profile",
      };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error updating user profile:", error.response?.statusText);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile",
      };
    }
  }
}

export async function getUserAddresses(userToken: string = "") {
  if (!userToken) {
    // console.log("User not authenticated");
    return { success: false, message: "User not authenticated" };
  }
  try {
    const response = await api.get("user-addresses", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    console.log("User addresses response:", response.data);
    if (response.data.result === "Success") {
      console.log("User addresses:", response.data.data);
      const addresses: UserAddress[] = response.data.data;
      return {
        success: true,
        data: addresses,
      };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching user addresses:",
        error.response?.statusText
      );
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch addresses",
      };
    }
  }
}

export async function addUserAddress(
  userToken: string = "",
  addressData: UserAddress,
  addressToUpdate: string = ""
) {
  console.log("Adding user address:", addressData);
  if (!userToken) {
    const session = await auth();
    userToken = session?.user?.token || session?.accessToken || "";
    if (!session || !session.user || !session.accessToken) {
      // console.log("User not authenticated");
      return { success: false, message: "User not authenticated" };
    }
  }
  try {
    const response = await api[addressToUpdate ? "put" : "post"](
      addressToUpdate ? `user-addresses/${addressToUpdate}` : "user-addresses",
      {
        ...addressData,
        is_default: addressData.is_default ? 1 : 0,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    console.log(" address added:", response.data.data);
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.data as UserAddress,
      };
    }
    return {
      success: false,
      message: response.data.message || "Failed to add address",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error adding user address:", error.response);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add address",
      };
    }
  }
}

export async function deleteUserAddress(
  userToken: string = "",
  addressId: string
) {
  if (!userToken) {
    const session = await auth();
    userToken = session?.user?.token || session?.accessToken || "";
    if (!session || !session.user || !session.accessToken) {
      // console.log("User not authenticated");
      return { success: false, message: "User not authenticated" };
    }
  }

  try {
    const response = await api.delete(`user-addresses/${addressId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.data as UserAddress,
      };
    }
    return {
      success: false,
      message: response.data.message || "Failed to delete address",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error deleting user address:", error.response);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete address",
      };
    }
  }
}

export async function getPharmacyShippingMethods(pharmacyId: number) {
  try {
    const response = await api.get(`pharmacies/${pharmacyId}/shipping`);
    console.log("Shipping methods response:", response.data);
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.data as ShippingMethod[],
      };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching pharmacy shipping methods:",
        error.response?.statusText
      );
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch shipping methods",
      };
    }
  }
}

export async function getSiteShippingMethods() {
  try {
    const response = await api.get(`site/shipping`);
    console.log("Shipping methods response:", response.data);
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.data as ShippingMethod[],
      };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching pharmacy shipping methods:",
        error.response?.statusText
      );
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch shipping methods",
      };
    }
  }
}

export async function updateUserLanguage(language: string, userToken?: string) {
  const authResult = await getAuthToken(userToken);
  if (!authResult.success) {
    return { success: false, message: authResult.message };
  }
  userToken = authResult.token;
  console.log("current :", language);
  const newLanguage = language === "ar" ? "en" : "ar";
  console.log("new lan: ", newLanguage);
  try {
    const response = await api.put(
      "user-profile",
      {
        language: newLanguage,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    if (response.data.result === "Success") {
      // Return success with updated data
      // The client should call update() from useSession to refresh the session
      return {
        success: true,
        data: response.data.data as UserProfile,
        message: "Language updated successfully",
      };
    }
    return {
      success: false,
      message: response.data.message || "Failed to update language",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error updating user language:", error.response);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update language",
      };
    }
  }
}

export async function getAuthData() {
  const session = await auth();
  return session;
}
