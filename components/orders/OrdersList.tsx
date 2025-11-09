"use client";

import { Order } from "@/lib/api/order";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, MapPin, Phone, Mail } from "lucide-react";

interface OrdersListProps {
  orders: Order[];
}

export default function OrdersList({ orders }: OrdersListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'In behandeling';
      case 'processing': return 'Wordt verwerkt';
      case 'confirmed': return 'Bevestigd';
      case 'delivered': return 'Geleverd';
      case 'cancelled': return 'Geannuleerd';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalPrice = (order: Order) => {
    return order.cards.reduce((total, item) => {
      const price = parseFloat(item.card.price) || 0;
      return total + (price * item.qty);
    }, 0);
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-gray-500 text-lg">
            U heeft nog geen bestellingen geplaatst
          </div>
          <Button className="mt-4">
            Start met Winkelen
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  Bestelling #{order.order_number}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {order.city}, {order.state}
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {getTotalPrice(order).toFixed(2)} {order.cards[0]?.card.currency || 'EGP'}
                </div>
                <div className="text-sm text-gray-500">
                  {order.cards.reduce((total, item) => total + item.qty, 0)} artikelen
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* informatie klant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold mb-2">
                  Klantinformatie
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {order.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {order.phone}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  Verzendadres
                </h4>
                <p className="text-sm">
                  {order.address_line}, {order.city}, {order.state} {order.zip_code}
                </p>
              </div>
            </div>

            {/* producten */}
            <div className="space-y-4">
              <h4 className="font-semibold">
                Bestelde Artikelen ({order.cards.length})
              </h4>
              
              {order.cards.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  {item.card.image && (
                    <img 
                      src={item.card.image} 
                      alt={item.card.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h5 className="font-medium">{item.card.name}</h5>
                    <p className="text-sm text-gray-600">{item.card.category}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span>Aantal: {item.qty}</span>
                      <span>Prijs: {item.card.price} {item.card.currency}</span>
                      <span className="font-semibold">
                        Totaal: {(parseFloat(item.card.price) * item.qty).toFixed(2)} {item.card.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* acties */}
           
          </CardContent>
        </Card>
      ))}
    </div>
  );
}