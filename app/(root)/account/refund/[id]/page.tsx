import { getReturnRequestDetails } from "@/lib/api/apiReturns";
import { ReturnRequestDetails } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import {
  PackageOpen,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  FileText,
  Package,
  Wallet,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

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

export default async function RefundRequestDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const response = await getReturnRequestDetails(id);

  if (!response?.success || !response.data) {
    notFound();
  }

  const request = response.data as ReturnRequestDetails;
  const currency = "EGP"; // You can get this from the API if available

  return (
    <section className="py-8">
      <div className="wrapper px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-6 hover:bg-accent"
          >
            <Link href="/account/refund">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Refund Requests
            </Link>
          </Button>

          {/* Header Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl">
                      Request #{request.id}
                    </CardTitle>
                    <Badge className={getStatusColor(request.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        <span className="capitalize">
                          {request.status.replace(/_/g, " ")}
                        </span>
                      </span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Order #{request.order_number}
                  </p>
                </div>

                {/* Refunded Indicator */}
                {request.is_refunded && (
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 h-fit">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Refunded
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Financial Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Amount
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(Number(request.total_amount), currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Refund Amount
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(Number(request.refund_amount), currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Refund Method
                  </p>
                  <div className="flex items-center gap-2">
                    {request.refund_to_wallet ? (
                      <>
                        <Wallet className="h-4 w-4 text-primary" />
                        <span className="font-medium">Wallet</span>
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Original Method</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Return Reason */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">
                    Return Reason
                  </h3>
                </div>
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-md">
                  {request.return_reason}
                </p>
              </div>

              <Separator />

              {/* Platform Notes */}
              {request.platform_notes && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-500" />
                    <h3 className="font-semibold text-foreground">
                      Platform Notes
                    </h3>
                  </div>
                  <p className="text-sm text-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                    {request.platform_notes}
                  </p>
                </div>
              )}

              {/* Pharmacy Notes */}
              {request.pharmacy_notes && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-purple-500" />
                    <h3 className="font-semibold text-foreground">
                      Pharmacy Notes
                    </h3>
                  </div>
                  <p className="text-sm text-foreground bg-purple-50 dark:bg-purple-950/20 p-3 rounded-md border border-purple-200 dark:border-purple-800">
                    {request.pharmacy_notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Returned Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Returned Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Image</TableHead>
                      <TableHead className="text-center">
                        Quantity Returned
                      </TableHead>
                      <TableHead className="text-center">
                        Original Qty
                      </TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          Product ID: {item.product_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.image ? (
                            <div className="flex justify-center">
                              <div className="relative w-12 h-12 rounded border">
                                <Image
                                  src={item.image}
                                  alt="Return proof"
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <div className="w-12 h-12 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {item.quantity_returned}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {item.quantity_original}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(item.unit_price), currency)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(Number(item.total_price), currency)}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.approved ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {request.items.map((item) => (
                  <Card key={item.id} className="border-border">
                    <CardContent className="p-4 space-y-3">
                      {/* Product Info */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            Product ID: {item.product_id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Item #{item.id}
                          </p>
                        </div>
                        {item.approved ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>

                      {/* Image */}
                      {item.image && (
                        <div className="relative w-24 h-24 rounded border mx-auto">
                          <Image
                            src={item.image}
                            alt="Return proof"
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}

                      {/* Quantities */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Returned</p>
                          <Badge variant="outline" className="mt-1">
                            {item.quantity_returned}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Original</p>
                          <p className="font-medium mt-1">
                            {item.quantity_original}
                          </p>
                        </div>
                      </div>

                      {/* Prices */}
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Unit Price:
                        </span>
                        <span className="font-medium">
                          {formatCurrency(Number(item.unit_price), currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(Number(item.total_price), currency)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
