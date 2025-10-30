// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { formatCurrency, formatCurrencyEGP } from "@/lib/utils";
// import { useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useGetOrders } from "@/hooks/useGetOrders";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Search, Calendar, MapPin, Phone, Mail, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import { toast } from "sonner";
// import { useGetProfile } from "@/hooks/useGetProfile";
// import { CURRENCY_CODE } from "@/lib/constants";
// import Image from "next/image";

// const Orders = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const queryClient = useQueryClient();
//   const { ordersData, isLoadingOrders, errorOrders } = useGetOrders();
//   const { profileData, isLoadoingProfile } = useGetProfile();

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 border border-yellow-200";
//       case "confirmed":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 border border-blue-200";
//       case "shipped":
//         return "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 border border-indigo-200";
//       case "delivered":
//         return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 border border-green-200";
//       case "cancelled":
//       case "canceled":
//         return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 border border-red-200";
//       case "returned":
//         return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 border border-purple-200";
//       case "completed":
//         return "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100 border border-teal-200";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-gray-200";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "pending":
//         return <Clock className="w-4 h-4" />;
//       case "confirmed":
//         return <CheckCircle className="w-4 h-4" />;
//       case "shipped":
//         return <Truck className="w-4 h-4" />;
//       case "delivered":
//         return <Package className="w-4 h-4" />;
//       case "cancelled":
//       case "canceled":
//         return <XCircle className="w-4 h-4" />;
//       case "completed":
//         return <CheckCircle className="w-4 h-4" />;
//       default:
//         return <Clock className="w-4 h-4" />;
//     }
//   };

//   const { mutate: cancelOrderMutation, isPending: isCancellingOrder } =
//     useMutation({
//       mutationFn: handleCancelOrder,
//       onSuccess: (response) => {
//         if (response && response.success) {
//           toast.success("Order canceled successfully");
//           queryClient.invalidateQueries({ queryKey: ["orders"] });
//         } else {
//           toast.error("Failed to cancel order");
//         }
//       },
//     });

//   async function handleCancelOrder(orderId: string) {
//   }

//   if (isLoadingOrders || isLoadoingProfile) {
//     return (
//       <div className="animate-pulse">
//         {[...Array(5)].map((_, index) => (
//           <div
//             key={index}
//             className="flex items-stretch justify-between gap-4 py-4"
//           >
//             <div className="flex flex-[2_2_0px] flex-col gap-4">
//               <div className="flex flex-col gap-1">
//                 <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
//                 <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
//                 <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
//               </div>
//               <Button
//                 variant="secondary"
//                 size="sm"
//                 className="rounded-full w-fit"
//               >
//                 <span className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></span>
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   const currency = profileData?.data?.currency_code || CURRENCY_CODE;

//   const filteredOrders = ordersData?.data?.filter((order) =>
//     order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
//     order.pharmacy_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     order.status.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//               My Orders
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               Track and manage your orders
//             </p>
//           </div>

//           {/* Search */}
//           <div className="mb-6">
//             <div className="relative max-w-md mx-auto">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <Input
//                 placeholder="Search by order ID, pharmacy, or status..."
//                 className="pl-12 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Orders Count */}
//           <div className="mb-6 text-center">
//             <p className="text-gray-600 dark:text-gray-400">
//               Showing {filteredOrders?.length || 0} orders
//             </p>
//           </div>

//           {/* Orders List */}
//           <div className="space-y-6">
//             {filteredOrders?.map((order) => (
//               <div
//                 key={order.id}
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
//               >
//                 {/* Order Header */}
//                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                     <div className="flex items-center gap-4">
//                       <div className="flex items-center gap-2">
//                         <Package className="w-5 h-5 text-primary" />
//                         <span className="font-semibold text-lg text-gray-900 dark:text-white">
//                           Order #{order.id}
//                         </span>
//                       </div>
//                       <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
//                         {getStatusIcon(order.status)}
//                         {order.status}
//                       </Badge>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                       <Calendar className="w-4 h-4" />
//                       <span>
//                         {new Date(order.created_at).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'short',
//                           day: 'numeric'
//                         })}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Content */}
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
//                     {/* Pharmacy & Shipping Info */}
//                     <div className="space-y-4">
//                       <div>
//                         <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//                           <MapPin className="w-4 h-4" />
//                           Pharmacy & Shipping
//                         </h3>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600 dark:text-gray-400">Pharmacy:</span>
//                             <span className="font-medium text-gray-900 dark:text-white capitalize">
//                               {order.pharmacy_name}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600 dark:text-gray-400">Shipping Method:</span>
//                             <span className="font-medium text-gray-900 dark:text-white">
//                               {order.shipping_method || 'Standard'}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600 dark:text-gray-400">Tracking Number:</span>
//                             <span className="font-medium text-gray-900 dark:text-white">
//                               {order.tracking_number || 'Not available'}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Contact Info */}
//                       <div>
//                         <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//                           <Mail className="w-4 h-4" />
//                           Contact Information
//                         </h3>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600 dark:text-gray-400">Email:</span>
//                             <span className="font-medium text-gray-900 dark:text-white">
//                               {order.email}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600 dark:text-gray-400">Phone:</span>
//                             <span className="font-medium text-gray-900 dark:text-white">
//                               {order.phone}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Address Information */}
//                     <div className="space-y-4">
//                       <div>
//                         <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//                           <MapPin className="w-4 h-4" />
//                           Shipping Address
//                         </h3>
//                         <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
//                           <div>{order.address_line}</div>
//                           <div>{order.city}, {order.state}</div>
//                           <div>{order.zip_code}</div>
//                           <div>{order.country}</div>
//                         </div>
//                       </div>

//                       {/* Payment Information */}
//                       <div>
//                         <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
//                           Payment Details
//                         </h3>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600 dark:text-gray-400">Method:</span>
//                             <span className="font-medium text-gray-900 dark:text-white capitalize">
//                               {order.payment_method}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600 dark:text-gray-400">Status:</span>
//                             <Badge className={getStatusColor(order.payment_status || 'pending')}>
//                               {order.payment_status || 'Pending'}
//                             </Badge>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Order Summary */}
//                     <div className="space-y-4">
//                       <div>
//                         <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
//                           Order Summary
//                         </h3>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
//                             <span className="font-medium text-gray-900 dark:text-white">
//                               {formatCurrency(Number(order.subtotal || order.total), currency)}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
//                             <span className="font-medium text-gray-900 dark:text-white">
//                               {formatCurrency(Number(order.shipping_cost || 0), currency)}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600 dark:text-gray-400">Tax:</span>
//                             <span className="font-medium text-gray-900 dark:text-white">
//                               {formatCurrency(Number(order.tax || 0), currency)}
//                             </span>
//                           </div>
//                           <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
//                             <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
//                             <span className="font-bold text-lg text-primary">
//                               {formatCurrency(Number(order.total), currency)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Order Items Preview */}
//                       <div>
//                         <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
//                           Items ({order.items_count || 0})
//                         </h3>
//                         <div className="space-y-2 max-h-32 overflow-y-auto">
//                           {order.items?.slice(0, 3).map((item, index) => (
//                             <div key={index} className="flex items-center gap-2 text-sm">
//                               {item.card?.image && (
//                                 <Image
//                                   src={item.card.image}
//                                   alt={item.card.name}
//                                   width={32}
//                                   height={32}
//                                   className="rounded object-cover"
//                                 />
//                               )}
//                               <div className="flex-1 min-w-0">
//                                 <p className="font-medium text-gray-900 dark:text-white truncate">
//                                   {item.card?.name || 'Product'}
//                                 </p>
//                                 <p className="text-gray-600 dark:text-gray-400 text-xs">
//                                   Qty: {item.quantity} × {formatCurrency(Number(item.card?.price || 0), currency)}
//                                 </p>
//                               </div>
//                             </div>
//                           ))}
//                           {order.items && order.items.length > 3 && (
//                             <p className="text-xs text-gray-500 text-center">
//                               +{order.items.length - 3} more items
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
//                     <Button
//                       asChild
//                       variant="secondary"
//                       size="sm"
//                       className="rounded-lg hover:bg-secondary/50 transition-colors duration-200"
//                     >
//                       <Link
//                         href={`/account/orders/${order.id}?remaining_days_to_return=${order.remaining_days_to_return}`}
//                       >
//                         View Full Details
//                       </Link>
//                     </Button>
                    
//                     {order.status.toLowerCase() === "pending" && (
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             className="rounded-lg hover:bg-red-600/50 transition-colors duration-200"
//                             disabled={isCancellingOrder}
//                           >
//                             {isCancellingOrder ? "Cancelling..." : "Cancel Order"}
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent>
//                           <DialogHeader>
//                             <DialogTitle>
//                               Are you sure you want to cancel this order?
//                             </DialogTitle>
//                             <DialogDescription>
//                               This action cannot be undone. Please confirm your decision.
//                             </DialogDescription>
//                           </DialogHeader>
//                           <DialogFooter>
//                             <DialogClose asChild>
//                               <Button variant="outline">No</Button>
//                             </DialogClose>
//                             <Button
//                               onClick={() =>
//                                 cancelOrderMutation(order.id.toString())
//                               }
//                             >
//                               Yes, Cancel Order
//                             </Button>
//                           </DialogFooter>
//                         </DialogContent>
//                       </Dialog>
//                     )}

//                     {/* Additional Actions Based on Status */}
//                     {order.status.toLowerCase() === "delivered" && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="rounded-lg"
//                       >
//                         Track Package
//                       </Button>
//                     )}

//                     {order.status.toLowerCase() === "completed" && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="rounded-lg"
//                       >
//                         Buy Again
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Empty State */}
//           {(!filteredOrders || filteredOrders.length === 0) && !isLoadingOrders && (
//             <div className="text-center py-12">
//               <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                 No orders found
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 mb-6">
//                 {searchQuery ? "No orders match your search criteria." : "You haven't placed any orders yet."}
//               </p>
//               {!searchQuery && (
//                 <Button asChild>
//                   <Link href="/products">
//                     Start Shopping
//                   </Link>
//                 </Button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Orders;


export default function order(){
  return(
    <h1>hello</h1>
  )
}