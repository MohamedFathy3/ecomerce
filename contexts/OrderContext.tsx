import React, { createContext, useContext } from "react";
import { UserAddress } from "@/types";

type OrderContextType = {
  shippingAddress?: string;
  shippingAddressValue?: string;
  shippingMethod?: string;
  shippingMethodValue?: string;
  paymentMethod?: string;
  paymentMethodValue?: string;
  pharmacyId?: number;
  setShippingAddress?: (address: string, value: string) => void;
  setPaymentMethod?: (method: string, value: string) => void;
  setShippingMethod?: (method: string, value: string) => void;
  setPharmacyId?: (id: number) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

type OrderAction =
  | { type: "SET_ADDRESS"; payload: { address: string; value: string } }
  | { type: "SET_PAYMENT_METHOD"; payload: { method: string; value: string } }
  | { type: "SET_SHIPPING_METHOD"; payload: { method: string; value: string } }
  | { type: "SET_PHARMACY_ID"; payload: number };

const orderReducer = (
  state: OrderContextType,
  action: OrderAction
): OrderContextType => {
  switch (action.type) {
    case "SET_ADDRESS":
      return {
        ...state,
        shippingAddress: action.payload.address,
        shippingAddressValue: action.payload.value,
      };
    case "SET_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethod: action.payload.method,
        paymentMethodValue: action.payload.value,
      };
    case "SET_SHIPPING_METHOD":
      return {
        ...state,
        shippingMethod: action.payload.method,
        shippingMethodValue: action.payload.value,
      };
    case "SET_PHARMACY_ID":
      return {
        ...state,
        pharmacyId: action.payload,
      };
    default:
      return state;
  }
};

export const OrderPovider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(orderReducer, {
    shippingAddress: "",
    shippingAddressValue: "",
    shippingMethod: "",
    shippingMethodValue: "",
    paymentMethod: "",
    paymentMethodValue: "",
    pharmacyId: undefined,
  });

  function setShippingAddress(address: string, value: string) {
    dispatch({ type: "SET_ADDRESS", payload: { address, value } });
  }

  function setPaymentMethod(method: string, value: string) {
    dispatch({ type: "SET_PAYMENT_METHOD", payload: { method, value } });
  }

  function setShippingMethod(method: string, value: string) {
    dispatch({ type: "SET_SHIPPING_METHOD", payload: { method, value } });
  }
  function setPharmacyId(id: number) {
    dispatch({ type: "SET_PHARMACY_ID", payload: id });
  }

  return (
    <OrderContext.Provider
      value={{
        ...state,
        setShippingAddress,
        setPaymentMethod,
        setShippingMethod,
        setPharmacyId,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
