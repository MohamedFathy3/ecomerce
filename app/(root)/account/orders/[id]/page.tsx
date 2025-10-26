"use client";

import RatingDialog from "@/components/custom/order/ratingDialog";
import RefundRequestDialog from "@/components/custom/order/RefundRequestDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderDetails } from "@/lib/api/apiOrders";
import { formatCurrency, formatCurrencyEGP } from "@/lib/utils";
import { OrderDetails, OrderDetailsItem } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  loadReturnRequest,
  saveReturnRequest,
  clearReturnRequest as clearReturnRequestStorage,
} from "@/lib/utils/returnRequestStorage";
import { AlertCircle } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "confirmed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    case "shipped":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100";
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    case "returned":
      return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
    case "completed":
      return "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [remainingDaysToReturn, setRemainingDaysToReturn] = useState<
    string | null
  >(null);

  const { data: session, status } = useSession();
  const [userToken, setUserToken] = useState<string>("");
  const [pending, startTransition] = useTransition();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [itemsToReturn, setItemsToReturn] = useState<OrderDetailsItem[]>([]);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  // Load return requests from localStorage on mount
  useEffect(() => {
    if (id && typeof id === "string") {
      const savedItems = loadReturnRequest(id);
      if (savedItems.length > 0) {
        setItemsToReturn(savedItems);
      }
    }
  }, [id]);

  // Save return requests to localStorage whenever they change
  useEffect(() => {
    if (id && typeof id === "string") {
      saveReturnRequest(id, itemsToReturn);
    }
  }, [itemsToReturn, id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const value = params.get("remaining_days_to_return");
      setRemainingDaysToReturn(value);
    }
  }, []);

  useEffect(
    function () {
      if (status === "authenticated" && session?.user.token) {
        setUserToken(session.user.token);
      } else {
        setUserToken("");
      }
    },
    [status]
  );

  useEffect(() => {
    if (userToken) {
      startTransition(fetchOrderDetails);
    }
  }, [userToken]);

  async function fetchOrderDetails() {
    const response = await getOrderDetails(userToken, Number(id));
    console.log(response);
    if (response?.success) {
      setOrderDetails(response.data as OrderDetails);
    }
  }

  // Clear return request from localStorage (call this after successful submission)
  const clearReturnRequest = () => {
    if (id && typeof id === "string") {
      clearReturnRequestStorage(id);
      setItemsToReturn([]);
    }
  };

  const handleAddToReturn = (item: OrderDetailsItem) => {
    setItemsToReturn((prevItems) => {
      if (isItemAlreadyAdded(item.product_id)) {
        return prevItems;
      }
      return [...prevItems, item];
    });
  };

  const isItemAlreadyAdded = (itemID: number) =>
    itemsToReturn.some((prevItem) => prevItem.product_id === itemID);

  const handleRemoveFromReturn = (item: OrderDetailsItem) => {
    setItemsToReturn((prevItems) =>
      prevItems.filter((prevItem) => prevItem.product_id !== item.product_id)
    );
  };

  if (pending)
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />

        {/* Table Skeleton */}
        <div className="overflow-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="p-4 font-medium text-foreground">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="p-4">
                      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary Skeleton */}
        <div className="h-32 bg-muted rounded animate-pulse" />

        {/* Shipping Address Skeleton */}
        <div className="h-12 bg-muted rounded animate-pulse" />

        {/* Payment Method Skeleton */}
        <div className="h-12 bg-muted rounded animate-pulse" />

        {/* Delivery Skeleton */}
        <div className="h-12 bg-muted rounded animate-pulse" />
      </div>
    );

  return (
    <div className="space-y-6 relative">
      {/* Order Header */}
      <div className="">
        <h1 className="flex gap-3 items-center text-2xl font-bold tracking-tight text-foreground">
          Order #{orderDetails?.id}
          <Badge
            className={`${getStatusColor(
              orderDetails?.status || ""
            )} text-base`}
          >
            {orderDetails?.status}
          </Badge>
          {orderDetails?.is_request_return && (
            <Badge
              variant="outline"
              className="text-base bg-orange-50 dark:bg-orange-950 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300"
            >
              <AlertCircle className="w-4 h-4 me-1" />
              Return Requested
            </Badge>
          )}
        </h1>
      </div>

      {/* Items Table */}
      <div className="overflow-auto rounded-xl border">
        <Table className="w-full text-sm">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="p-4 font-medium text-foreground">
                Name
              </TableHead>
              <TableHead className="p-4 font-medium text-foreground">
                Quantity
              </TableHead>
              <TableHead className="p-4 font-medium text-foreground">
                Unit Price
              </TableHead>
              <TableHead className="p-4 font-medium text-foreground">
                Total
              </TableHead>
              {/* {(orderDetails?.status.toLowerCase() === "delivered" ||
                orderDetails?.status.toLowerCase() === "completed") && (
                <TableHead className="p-4 font-medium text-foreground">
                  Actions
                </TableHead>
              )} */}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {orderDetails?.items.map((item) => (
              <TableRow key={item.product_id}>
                <TableCell className="p-4">{item.product_name}</TableCell>
                <TableCell className="p-4">{item.quantity}</TableCell>
                <TableCell className="p-4 text-muted-foreground">
                  {formatCurrency(+item.unit_price, orderDetails?.currency)}
                </TableCell>
                <TableCell className="p-4 text-muted-foreground">
                  {formatCurrency(+item.total, orderDetails?.currency)}
                </TableCell>
                {/* Rate Action */}
                {/* {(orderDetails?.status.toLowerCase() === "delivered" ||
                  orderDetails?.status.toLowerCase() === "completed" ||
                  orderDetails?.status.toLowerCase() === "returned") && (
                  <TableCell className="p-4 flex items-center gap-2">
                    {(orderDetails?.status.toLowerCase() === "delivered" ||
                      orderDetails?.status.toLowerCase() === "completed" ||
                      orderDetails?.status.toLowerCase() === "returned") && (
                      <RatingDialog userToken={userToken} item={item} />
                    )}
                    {!orderDetails?.is_request_return &&
                      (orderDetails?.status.toLowerCase() === "delivered" ||
                        remainingDaysToReturn) && (
                        <Button
                          variant={
                            isItemAlreadyAdded(item.product_id)
                              ? "destructive"
                              : "secondary"
                          }
                          size="sm"
                          className="rounded-full"
                          onClick={() => {
                            if (isItemAlreadyAdded(item.product_id)) {
                              handleRemoveFromReturn(item);
                              return;
                            }
                            handleAddToReturn(item);
                            // toast.success("Product added to refund request", {
                            //   description: `${item.product_name} has been added. You can add more or view the request.`,
                            //   action: {
                            //     label: "View Request",
                            //     onClick: () => setIsRefundDialogOpen(true),
                            //   },
                            // });
                            toast(
                              <div className="space-y-2 ">
                                <span>
                                  ${item.product_name} has been added. You can
                                  add more or view the request.
                                </span>
                                <Button
                                  variant="link"
                                  className="underline block ms-auto"
                                  onClick={() => setIsRefundDialogOpen(true)}
                                >
                                  View Request
                                </Button>
                              </div>
                            );
                          }}
                        >
                          {isItemAlreadyAdded(item.product_id)
                            ? "remove from return"
                            : "Add to Return"}
                        </Button>
                      )}
                  </TableCell>
                )} */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Return Request Note */}
      {orderDetails?.is_request_return && (
        <Card className="border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                  Return Request Submitted
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  A return request has already been submitted for this order.
                  You can view the status in your{" "}
                  <Link
                    href="/account/refund"
                    className="underline font-medium hover:text-orange-900 dark:hover:text-orange-100"
                  >
                    refund requests
                  </Link>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button for Return Request */}
      {/* {itemsToReturn.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={() => setIsRefundDialogOpen(true)}
            size="lg"
            className="shadow-lg h-14 px-6 rounded-full"
          >
            View Return Request ({itemsToReturn.length})
          </Button>
        </div>
      )} */}

      {/* if there are items to return show a dialog button that opens the return request dialog */}
      {/* {itemsToReturn.length > 0 && (
        <Button onClick={() => setIsRefundDialogOpen(true)}>
          Show Return Request ({itemsToReturn.length} item
          {itemsToReturn.length > 1 ? "s" : ""})
        </Button>
      )} */}

      {/* Refund Request Dialog */}
      {/* <RefundRequestDialog
        open={isRefundDialogOpen}
        onOpenChange={setIsRefundDialogOpen}
        items={itemsToReturn}
        orderId={Number(id)}
        onRemoveItem={handleRemoveFromReturn}
        currency={orderDetails?.currency}
        onSubmitSuccess={clearReturnRequest}
      /> */}

      {/* Order Summary */}
      <Card>
        <CardContent className="space-y-2">
          <h3 className="text-lg font-bold">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>
              {formatCurrency(
                Number(orderDetails?.total),
                orderDetails?.currency
              )}
            </span>
          </div>
          {orderDetails?.coupon_discount && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Coupon</span>
              <span>
                {formatCurrencyEGP(Number(orderDetails?.coupon_discount))}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {formatCurrency(
                Number(orderDetails?.shipping_cost),
                orderDetails?.currency
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>
              {formatCurrency(
                Number(orderDetails?.total_after_shipping),
                orderDetails?.currency
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold">Shipping Address</h3>
        <p className="text-sm">
          {orderDetails?.shipping_address || "No shipping address provided"}
        </p>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold">Payment Method</h3>

        <p className="text-base truncate capitalize">
          {orderDetails?.payment_type || "No payment method provided"}
        </p>
      </div>

      {/* Delivery */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold">Delivery Date</h3>
        <p className="text-sm">
          Estimated delivery:{" "}
          {orderDetails?.due_date || "No delivery date provided"}
        </p>
      </div>
    </div>
  );
}
