import z, { boolean } from "zod";
import { formatCurrencyEGP } from "./utils";

export const currency = z.string().refine(
  (val) => {
    try {
      return formatCurrencyEGP(Number(val)) === val;
    } catch {
      return false;
    }
  },
  { message: "Invalid currency format" }
);

export const gender = z.string().refine(
  (val) => {
    return val === "male" || val === "female";
  },
  {
    message: "Gender must be either 'male' or 'female'",
  }
);

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Product slug is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  image: z.string().url("Image must be a valid URL"),
  unitPrice: currency,
  totalPrice: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart must have at least one item"),
  total: currency,
  totalItems: z.number().int().min(1, "Total items must be at least 1"),
  totalPrice: currency,
  totalPriceWithDiscount: currency.optional(),
  discount: z.number().int().min(0, "Discount must be at least 0").optional(),
  userId: z.string().optional().nullable(),
  sessionCartId: z.string().min(1, "Session Cart ID is required"),
});

export const cardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  number: z
    .string()
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Card number must be 16 digits"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
  setDefault: z.boolean().optional(),
});

// Authentication types

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    phone: z
      .string()
      .regex(/^\+?[0-9]{7,15}$/, "Phone must be a valid phone number"),
    email: z.string().email("Email must be a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  
  })
  

// Doctor Rigister schema
export const doctorRegisterSchema = registerSchema.extend({
  license_number: z.string().min(1, "License number is required"),
  certificate_file: z.string().refine(
    (val) => {
      // Accept URLs ending with allowed extensions
      return (
        typeof val === "string" &&
        /\.(pdf|doc|docx|jpg|jpeg|png|svg)$/i.test(val)
      );
    },
    {
      message:
        "Certificate file must be a valid PDF, DOC, DOCX, JPG, PNG, JPEG, or SVG file URL",
    }
  ),
  specialization: z.string().min(1, "Specialization is required"),
  is_doctor: z.number().min(0).max(1).default(1).optional(),
});

// Create the signin schema
export const signInSchema = z.object({
  email: z.string().email("Email must be a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const profileSchema = z.object({
  id: z.string(),
  name:z.string().min(2, " name is required"),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Phone must be a valid phone number"),
  email: z.string().email("Email must be a valid email address"),
  avatar: z.string().url("Profile image must be a valid URL").optional(),
  // currency_code: z.string().optional(),
});

export const userAddressSchema = z.object({
  name: z.string().min(1, "Address name is required"),
  phone: z
    .string()
    .regex(/^\+20\d{10}$/, "Phone must be a valid Egyptian number"),
  building: z.string().min(1, "Building is required"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
  is_default: z.number().int().min(0).max(1).optional(),
});

// Plan Subscription schema
export const planSubscriptionFormSchema = z
  .object({
    plan_id: z.number().int().min(1, "Plan ID is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Email must be a valid email address"),
    phone: z
      .string()
      .regex(/^\+?[0-9]{7,15}$/, "Phone must be a valid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(8, "Password confirmation must be at least 8 characters")
      .optional(),
    pharmacy_name_ar: z.string().min(1, "Pharmacy name in Arabic is required"),
    pharmacy_name_en: z.string().min(1, "Pharmacy name in English is required"),
    pharmacy_address_ar: z
      .string()
      .min(1, "Pharmacy address in Arabic is required"),
    pharmacy_address_en: z
      .string()
      .min(1, "Pharmacy address in English is required"),
    pharmacy_phone: z
      .string()
      .regex(/^\+?[0-9]{7,15}$/, "Pharmacy phone must be a valid phone number"),
    pharmacy_email: z
      .string()
      .email("Pharmacy email must be a valid email address"),
    payment_method: z
      .enum(["card", "cash", "wallet"])
      .refine((val) => ["card", "cash", "wallet"].includes(val), {
        message: "Payment method must be either 'card', 'cash', or 'wallet'",
      }),
  })
  .refine(
    (data) =>
      !data.password_confirmation ||
      data.password === data.password_confirmation,
    {
      message: "Passwords must match",
      path: ["password_confirmation"],
    }
  );

export const updateUserPasswordSchema = z
  .object({
    current_password: z.string().min(8, "Current password is required"),
    password: z.string().min(8, "New password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(8, "New password confirmation must be at least 8 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "New passwords must match",
    path: ["new_password_confirmation"],
  });
