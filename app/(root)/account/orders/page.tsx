import { getUserOrders, type Order } from "@/lib/api/order";
import { getAuthToken } from "@/lib/api/helpers";
import { redirect } from "next/navigation";
import OrdersList from "@/components/orders/OrdersList";

export default async function OrdersPage() {
  const authResult = await getAuthToken();
  if (!authResult.success) {
    redirect("/signin");
  }

  let orders: Order[] = [];
  
  try {
    const response = await getUserOrders(authResult.token);
    if (response.result === "Success") {
      orders = response.data;
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mijn Bestellingen
          </h1>
          <p className="text-gray-600 mt-2">
            Bekijk uw bestelgeschiedenis en volg uw aankopen
          </p>
        </div>

        <OrdersList orders={orders} />
      </div>
    </div>
  );
}