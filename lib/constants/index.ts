export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "hamad";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Prostore is your one-stop online shop for the latest electronics, fashion, and home essentials. Enjoy fast shipping, secure checkout, and unbeatable deals every day.";

export const NEXT_PUBLIC = "https://hamad-store.vercel.app/";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_SERVER_URL ||
  "https://backend.valideria.com/";
export const SERVER_URL_images =
  process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_SERVER_URL_IMAGES ||
  "https://backend.valideria.com/storage";

export const API_URL =
  process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_API_BASE_URL ||
  "https://backend.valideria.com/api/";

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: "admin@example.com",
  password: "12345678",
};

export const signUpDefaultValues = {
  first_name: "Ahmed",
  last_name: "Othman",
  governorate: "Cairo",
  gender: "male",
  age: "30",
  phone: "+201234567890",
  email: "admin@example.com",
  password: "12345678",
  password_confirmation: "12345678",
  license_number: "123456",
  specialization: "Cardiology",
};

export const EGYPT_GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Menofia",
  "Minya",
  "Qaliubiya",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "Sharkia",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
];

export const CURRENCY_CODE = "IQD";
