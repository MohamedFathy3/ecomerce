import {
  cardSchema,
  cartItemSchema,
  doctorRegisterSchema,
  insertCartSchema,
  planSubscriptionFormSchema,
  profileSchema,
  registerSchema,
  signInSchema,
  updateUserPasswordSchema,
  userAddressSchema,
} from "@/lib/validators";
import { CredentialsSignin } from "next-auth";
import z from "zod";

// Authentication types
export type RegisterFormData = z.infer<typeof registerSchema>;

export type DoctorRegisterFormData = z.infer<typeof doctorRegisterSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;

export type UpdateUserPasswordData = z.infer<typeof updateUserPasswordSchema>;

export type PlanSubscriptionFormData = z.infer<
  typeof planSubscriptionFormSchema
>;

export type plan = {
  id: number;
  type: "annual" | "monthly" | string;
  description: string;
  price: string;
  currency: string;
  duration_in_days: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string | null;
};

export class SignInError extends CredentialsSignin {
  message = "signin_error";
}

export type User = {
  id: string;
  email: string;
  token?: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  language: string;
  governorate: string;
  phone: string;
  emailVerified: boolean;
  profileImage: string | null;
  currency_code?: string | null;
  is_doctor?: boolean;
};
export type UserProfile = z.infer<typeof profileSchema> & {
  currency_code?: string | null;
};
export type UserAddress = z.infer<typeof userAddressSchema> & {
  id?: string;
  user_id?: string;
};

// -------------------

export type CardFormData = z.infer<typeof cardSchema>;

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingMethod = {
  id: number;
  value: string;
  type: string;
  pharmacy_id: number;
  duration: number;
};
// Product types

export type TaxInfo = {
  tax_rate: number;
  tax_value: number;
  price_with_tax: number;
};

export type OfferPeriod = {
  start_date: string;
  end_date: string;
};

export type ProductOffer = {
  product_id: number;
  offer_title: string;
  price_before: number;
  price_after: number;
  discount: number;
  discount_percentage: number;
  offer_period: OfferPeriod;
  tax: TaxInfo;
};

export type Pharmacy = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  image: string;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  user_name: string;
  user_image: string | null;
  rate: number;
  comment: string;
};

export type ProductItem = {
  id: number;
  name: string;
  pharmacy_id: number;
  price: number;
  quantity: number;
  image: string | null;
  brand_id: number;
  category_id: number;
  average_rating: {
    user: number;
    count_user_rate: number;
    pharmacist: number;
    count_pharmacist_rate: number;
  };
  tax_rate: number;
  final_price: number;
  offer_discount?: number | null;
  currency: string;
  currency_symbol: string;
};

export type ProductItemCompare = {
  id: number;
  name: string;
  pharmacy: Pharmacy;
  generic_name: string;
  type: string;
  form: string;
  brand_id: number;
  category_id: number;
  strength: string;
  price: number;
  quantity: number;
  image: string | null;
  average_rating: {
    user: number;
    count_user_rate: number;
    pharmacist: number;
    count_pharmacist_rate: number;
  };
  tax_rate: string;
  production_date: string;
  expiry_date: string;
  pack_size: string | null;
  description: string;
  show_home: number;
  categoryName: string;
  brandName: string;
  offer?: ProductOffer | null;
};

export type Product = {
  id: number;
  name: string;
  pharmacy: Pharmacy;
  generic_name: string;
  type: string;
  form: string;
  strength: string;
  price: number;
  quantity: number;
  brand_id: number;
  category_id: number;
  image: string | null;
  average_rating: {
    user: number;
    count_user_rate: number;
    doctor: number;
    count_doctor_rate: number;
  };
  tax_rate: number;
  production_date: string;
  expiry_date: string;
  barcode: string | null;
  pack_size: string | null;
  description: string;
  categoryName: string;
  brandName: string;
  gallery: string[] | null;
  offer: ProductOffer | null;
  user_comments: Comment[];
  doctors_comments: Comment[];
  similar_products: ProductItem[];
};

export type addRate = {
  rate: number;
  rate_text: string;
};

export type FavoriteItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  created_at: string;
};

export type category = {
  id: string;
  position: number | null;
  name: string;
  show_home: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deleted: boolean;
  image: string;
};

export type Brand = {
  id: number;
  position: number | null;
  name: string;
  show_home: boolean;
  rating: number | null;
  image: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deleted: boolean;
};

export type CartProductItem = {
  product_id: number;
  name: string;
  base_price: number;
  final_price: number;
  tax_amount: number;
  quantity: number;
  total: number;
  free_quantity: number;
  price_after_discount: number;
};

export type CartPharmacy = {
  pharmacy_id: number;
  pharmacy_name: string;
  pharmacy_image: string;
  items: CartProductItem[];
  total: number;
  coupon_discount: number;
  total_after_coupon: number;
  coupon_id: string | null;
  promocoded: string | null;
};

export type CartData = {
  pharmacies: CartPharmacy[];
};

export type pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

// orders
export type orderSaveParams = {
  code?: string;
  pharmacy_id: number;
  shipping_id: number;
  shipping_address: number;
  payment_method: string;
};

export type OrderItem = {
  id: number;
  pharmacy_id: number;
  order_number: string;
  pharmacy_name: string;
  status: string;
  total: string;
  total_after_shipping: string;
  is_paid: boolean;
  remaining_days_to_return: number;
};
export type OrderDetailsItem = {
  id: number;
  product_id: number;
  product_name: string;
  unit_price: string;
  discount: string;
  tax_rate: string;
  tax_amount: string;
  subtotal: string;
  quantity: number;
  total: string;
};

export type OrderDetails = {
  id: number;
  order_number: string;
  pharmacy_id: number;
  pharmacy_name: string;
  status: string;
  subtotal: string;
  coupon_discount: string;
  total: string;
  shipping_address: string;
  shipping_cost: string;
  total_after_shipping: string;
  paid_from_points: string;
  paid_by_card: string;
  is_paid: boolean;
  earned_points: number;
  payment_type: string;
  due_date: string | null;
  paid_amount: string;
  remaining_amount: string;
  items: OrderDetailsItem[];
  currency: string;
  is_request_return: boolean;
};

export type ItemToReturn = {
  order_item_id: number;
  quantity: number;
  image?: File | string | null;
};

export type ReturnRequest = {
  order_id: string;
  return_reason: string;
  items: ItemToReturn[];
};

export type ReturnedRequest = {
  id: number;
  order_id: number;
  order_number: string;
  status: string;
  return_reason: string;
  platform_notes: string | null;
  pharmacy_notes: string | null;
  total_amount: string;
  refund_amount: string;
  refund_to_wallet: boolean;
  is_refunded: boolean;
};

export type ReturnRequestDetails = ReturnedRequest & {
  items: {
    id: number;
    product_id: number;
    quantity_returned: number;
    quantity_original: number;
    unit_price: string;
    total_price: string;
    image: string | null;
    approved: boolean;
  }[];
};

// -------------
export type SearchParams = { [key: string]: string | string[] | undefined };

export type PaymentMethod = {
  id: number;
  name: { en: string; ar: string };
};

// ----------------

export type wallet = {
  wallet_balance: string;
  total_points: number;
  available_points: number;
  point_transctions: {
    id: number;
    type: string;
    points: number;
    description: string;
    created_at: string;
  }[];
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  order_id: number;
  order_number: string;
  created_at: string;
  read_at: string | null;
};
