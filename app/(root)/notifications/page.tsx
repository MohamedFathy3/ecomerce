"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
  ShoppingCart,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Notification } from "@/types";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api/apiNotifications";
import { toast } from "sonner";
import { useGetNotifications } from "@/hooks/useGetNotifications";
import { useQueryClient } from "@tanstack/react-query";

type NotificationType =
  | "order_placed"
  | "order_confirmed"
  | "order_delivered"
  | "order_shipped"
  | "order_canceled"
  | "return_request_placed"
  | "return_request_accepted"
  | "return_request_rejected";

// util functions to get icon and badge based on notification type

const getNotificationIcon = (type: NotificationType) => {
  const iconProps = { size: 20 };

  switch (type) {
    case "order_placed":
      return <ShoppingCart {...iconProps} className="text-blue-600" />;
    case "order_confirmed":
      return <CheckCircle {...iconProps} className="text-green-600" />;
    case "order_shipped":
      return <Truck {...iconProps} className="text-purple-600" />;
    case "order_delivered":
      return <Package {...iconProps} className="text-green-700" />;
    case "order_canceled":
      return <XCircle {...iconProps} className="text-red-600" />;
    case "return_request_placed":
      return <RotateCcw {...iconProps} className="text-orange-600" />;
    case "return_request_accepted":
      return <CheckCircle {...iconProps} className="text-green-600" />;
    case "return_request_rejected":
      return <XCircle {...iconProps} className="text-red-600" />;
    default:
      return <Bell {...iconProps} className="text-gray-600" />;
  }
};

const getNotificationBadge = (type: NotificationType) => {
  switch (type) {
    case "order_placed":
      return <Badge variant="secondary">جديد</Badge>;
    case "order_confirmed":
      return <Badge variant="default">مؤكد</Badge>;
    case "order_shipped":
      return <Badge variant="secondary">مُرسل</Badge>;
    case "order_delivered":
      return (
        <Badge variant="default" className="bg-green-600">
          مُسلم
        </Badge>
      );
    case "order_canceled":
      return <Badge variant="destructive">ملغي</Badge>;
    case "return_request_placed":
      return <Badge variant="outline">طلب إرجاع</Badge>;
    case "return_request_accepted":
      return (
        <Badge variant="default" className="bg-green-600">
          مقبول
        </Badge>
      );
    case "return_request_rejected":
      return <Badge variant="destructive">مرفوض</Badge>;
    default:
      return <Badge variant="secondary">إشعار</Badge>;
  }
};
// end util functions

const Notifications = () => {
  const queryClient = useQueryClient();
  const { notificationsData, isLoadingNotifications } = useGetNotifications();

  if (!notificationsData?.success) {
    return <div className="text-red-500">Failed to load notifications</div>;
  }

  const notifications = notificationsData.data.notifications as Notification[];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "الآن";
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `منذ ${diffInDays} يوم`;
    }
  };

  const markAsRead = async (notificationId: string) => {
    const response = await markNotificationAsRead(notificationId);
    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("تم تعيين الإشعار كمقروء");
    } else {
      toast.error(response.message || "فشل في تعيين الإشعار كمقروء");
    }
  };

  const markAllAsRead = async () => {
    const response = await markAllNotificationsAsRead();
    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("تم تعيين جميع الإشعارات كمقروءة");
    } else {
      toast.error(response.message || "فشل في تعيين جميع الإشعارات كمقروءة");
    }
  };

  if (isLoadingNotifications) {
    return (
      <div className="wrapper min-h-screen py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  الإشعارات
                </h1>
                <p className="text-sm text-muted-foreground">
                  جاري تحميل الإشعارات...
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      <div className="mt-3 h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="wrapper min-h-screen py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  الإشعارات
                </h1>
                <p className="text-sm text-muted-foreground">
                  جميع الإشعارات مقروءة
                </p>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد إشعارات</h3>
                <p className="text-muted-foreground text-center">
                  ستظهر هنا جميع إشعاراتك المتعلقة بالطلبات والإرجاعات
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications?.filter((n) => !n.read_at).length || 0;

  return (
    <div className="wrapper min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                الإشعارات
              </h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} إشعار غير مقروء`
                  : "جميع الإشعارات مقروءة"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              تعيين الكل كمقروء
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد إشعارات</h3>
                <p className="text-muted-foreground text-center">
                  ستظهر هنا جميع إشعاراتك المتعلقة بالطلبات والإرجاعات
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification, index) => (
              <Card
                key={notification.id}
                className={`transition-all duration-200 hover:shadow-md ${
                  !notification.read_at
                    ? "border-l-4 border-l-primary bg-primary/5"
                    : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    {/* <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div> */}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            {/* {getNotificationBadge(notification.type)} */}
                            {!notification.read_at && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-2 ">
                            {notification.body}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              ORDER-{notification.order_id}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!notification.read_at && (
                        <div className="mt-3">
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                          >
                            تعيين كمقروء
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>

                {index < notifications.length - 1 && <Separator />}
              </Card>
            ))
          )}
        </div>

        {/* Footer info */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <AlertCircle className="h-4 w-4" />
              سيتم الاحتفاظ بالإشعارات لمدة 30 يوماً
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
