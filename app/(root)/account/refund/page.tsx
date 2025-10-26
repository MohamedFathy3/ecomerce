import { getReturnedRequests } from "@/lib/api/apiReturns";
import { ReturnedRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  PackageOpen,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export default async function RefundPage() {
  const response = await getReturnedRequests();

  if (!response?.success) {
    return (
      <section className="py-8">
        <div className="wrapper px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-destructive">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Error Loading Refund Requests
                </h3>
                <p className="text-muted-foreground text-center">
                  {response?.message}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  const returnedRequests = response.data as ReturnedRequest[];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase().replace(/\s+/g, "_")) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "platform_received":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "pharmacy_pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      case "pharmacy_received":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "refunded":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase().replace(/\s+/g, "_")) {
      case "pending":
      case "pharmacy_pending":
        return <Clock className="h-4 w-4" />;
      case "platform_received":
      case "pharmacy_received":
        return <PackageOpen className="h-4 w-4" />;
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "refunded":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <section className="py-8">
      <div className="wrapper px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Refund Requests
            </h1>
            <p className="text-muted-foreground">
              Track and manage your refund requests
            </p>
          </div>

          {/* Empty State */}
          {returnedRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <PackageOpen className="h-20 w-20 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Refund Requests
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  You haven&apos;t submitted any refund requests yet
                </p>
                <Button asChild variant="default">
                  <Link href="/account/orders">View Orders</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Refund Requests List */
            <div className="space-y-4">
              {returnedRequests.map((request) => (
                <Card
                  key={request.id}
                  className="hover:shadow-lg transition-shadow duration-200 border-border"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      {/* Header Row */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              Request #{request.id}
                            </h3>
                            <Badge className={getStatusColor(request.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(request.status)}
                                <span className="capitalize">
                                  {request.status}
                                </span>
                              </span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Order #{request.order_number}
                          </p>
                        </div>

                        {/* Refund Status Indicator */}
                        {/* {request.is_refunded && (
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Refunded
                          </Badge>
                        )} */}
                      </div>

                      {/* Refund Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-t border-b border-border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Total Amount
                          </p>
                          <p className="text-base font-semibold text-foreground">
                            {formatCurrency(
                              Number(request.total_amount),
                              "EGP"
                            )}
                          </p>
                        </div>
                        {request.is_refunded && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Refund Amount
                            </p>
                            <p className="text-base font-semibold text-primary">
                              {formatCurrency(
                                Number(request.refund_amount),
                                "EGP"
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Refund Method */}
                      {request.refund_to_wallet && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">Refund Method:</span>
                          <Badge variant="outline">Wallet</Badge>
                        </div>
                      )}

                      {/* Reason Preview */}
                      {request.return_reason && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">
                            Reason
                          </p>
                          <p className="text-sm text-foreground line-clamp-2">
                            {request.return_reason}
                          </p>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex justify-end pt-2">
                        <Button
                          asChild
                          variant="secondary"
                          size="default"
                          className="rounded-full hover:bg-secondary/70 transition-colors duration-200"
                        >
                          <Link href={`/account/refund/${request.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
