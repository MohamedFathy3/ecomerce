// "use server";

// import { api } from "../axios";
// import { AxiosError } from "axios";
// import { auth } from "../auth";
// import { Notification } from "@/types";

// export async function getNotifications(token?: string) {
//   try {
//     if (!token) {
//       const session = await auth();
//       token = session?.user?.token || session?.accessToken || "";
//       if (!session || !session.user || !session.accessToken) {
//         return { success: false, message: "User not authenticated" };
//       }
//     }
//     const response = await api.get("/notifications", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     // console.log("Notifications response:", response.data);
//     if (response.data.result === "Success") {
//       return {
//         success: true,
//         data: response.data.data,
//       };
//     }
//     return {
//       success: false,
//       message: response.data.message || "Failed to retrieve notifications",
//     };
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     return {
//       success: false,
//       message: "Failed to retrieve notifications",
//     };
//   }
// }

// export async function markNotificationAsRead(
//   notificationId: string,
//   token?: string
// ) {
//   try {
//     if (!token) {
//       const session = await auth();
//       token = session?.user?.token || session?.accessToken || "";
//       if (!session || !session.user || !session.accessToken) {
//         return { success: false, message: "User not authenticated" };
//       }
//     }
//     // console.log("Marking notification as read:", notificationId);
//     const response = await api.get(`notifications/read/${notificationId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log("Mark as read response:", response.data);
//     if (response.data.result === "Success") {
//       return {
//         success: true,
//         message: "Notification marked as read",
//       };
//     }
//     return {
//       success: false,
//       message: response.data.message || "Failed to mark notification as read",
//     };
//   } catch (error) {
//     console.error("Error marking notification as read:", error);
//     return {
//       success: false,
//       message: "Failed to mark notification as read",
//     };
//   }
// }

// export async function markAllNotificationsAsRead(token?: string) {
//   try {
//     if (!token) {
//       const session = await auth();
//       token = session?.user?.token || session?.accessToken || "";
//       if (!session || !session.user || !session.accessToken) {
//         return { success: false, message: "User not authenticated" };
//       }
//     }
//     const response = await api.get("notifications/read-all", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log("Mark all as read response:", response.data);
//     if (response.data.result === "Success") {
//       return {
//         success: true,
//         message: "All notifications marked as read",
//       };
//     }
//     return {
//       success: false,
//       message:
//         response.data.message || "Failed to mark all notifications as read",
//     };
//   } catch (error) {
//     console.error("Error marking all notifications as read:", error);
//     return {
//       success: false,
//       message: "Failed to mark all notifications as read",
//     };
//   }
// }
