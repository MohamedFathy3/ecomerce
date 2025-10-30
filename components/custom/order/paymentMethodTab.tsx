// "use client";

// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Banknote,
//   CheckCircle,
//   CreditCard,
//   DollarSign,
//   Info,
//   Landmark,
//   Upload,
//   WalletCards,
// } from "lucide-react";

// import { Input } from "@/components/ui/input";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import ButtonStepNav from "./buttonStepNav";

// import { useOrder } from "@/contexts/OrderContext";
// import { cardSchema } from "@/lib/validators";
// import {
//   CardFormData,
//   CartData,
//   CartPharmacy,
//   PaymentMethod,
//   wallet,
// } from "@/types";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSession } from "next-auth/react";
// import { useSearchParams } from "next/navigation";
// import AddNewCardDialog from "./addNewCardDialog";
// import { getCartData } from "@/lib/api/apiCart";
// import { useGetCart } from "@/hooks/useGetCart";
// import { useGetWallet } from "@/hooks/useGetWallet";
// // const paymentMethods = [
// //   // "Card",
// //   // "Zain Pay",
// //   "Cash on Delivery",
// //   //  "Pay Later"
// // ];
// const savedCards = [
//   {
//     name: "Visa",
//     info: "Ending in 4242",
//     icon: <CreditCard className="h-6 w-10 text-blue-600" />,
//     expired: false,
//   },
//   {
//     name: "Mastercard",
//     info: "Ending in 1234",
//     icon: <Landmark className="h-6 w-10 text-orange-500" />,
//     expired: false,
//   },
//   {
//     name: "American Express",
//     info: "Ending in 5678",
//     icon: <Banknote className="h-6 w-10 text-green-600" />,
//     expired: true,
//   },
//   {
//     name: "Discover",
//     info: "Ending in 8765",
//     icon: <WalletCards className="h-6 w-10 text-purple-600" />,
//     expired: false,
//   },
//   {
//     name: "JCB",
//     info: "Ending in 1122",
//     icon: <WalletCards className="h-6 w-10 text-pink-500" />,
//     expired: false,
//   },
//   {
//     name: "Diners Club",
//     info: "Ending in 3344",
//     icon: <DollarSign className="h-6 w-10 text-yellow-500" />,
//     expired: false,
//   },
// ];

// export default function PaymentMethodTab({
//   onBack,
//   onNext,
// }: {
//   onBack: () => void;
//   onNext: () => void;
// }) {
//   const searchParams = useSearchParams();
//   const { data: session, status } = useSession();
//   const [userToken, setUserToken] = useState<string>("");

//   const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
//   const {
//     pharmacyId,
//     setPharmacyId,
//     setPaymentMethod,
//     paymentMethod,
//     paymentMethodValue,
//   } = useOrder();

//   const [pharmacyData, setPharmacyData] = useState<CartPharmacy | null>(null);
//   const [walletInfo, setWalletInfo] = useState<wallet | null>(null);

//   const { data: cartData, isLoading: isLoadingCart } = useGetCart();
//   const { walletDetails, isLoadingWallet } = useGetWallet();

//   async function handleGetPaymentMethods() {
//     console.log(response);
//     if (response.success) {
//       setPaymentMethods(response.data as PaymentMethod[]);
//     }
//   }

//   useEffect(() => {
//     handleGetPaymentMethods();
//     if (cartData?.success && walletDetails?.success) {
//       const pharmacy = (cartData.data as CartData).pharmacies.find(
//         (ph) => ph.pharmacy_id === pharmacyId
//       );
//       setPharmacyData(pharmacy as CartPharmacy);
//       setWalletInfo(walletDetails.data as wallet);
//     }
//   }, [cartData, walletDetails, pharmacyId]);

//   useEffect(() => {
//     const pharmacyId = searchParams.get("pharmacyId");
//     if (pharmacyId) {
//       setPharmacyId?.(parseInt(pharmacyId));
//     }
//   }, [searchParams]);

//   const [selectedPayment, setSelectedPayment] = useState(
//     paymentMethods[0]?.name.en || paymentMethod || ""
//   );
//   const [selectedCard, setSelectedCard] = useState("Visa");
//   const [showNewCardDialog, setShowNewCardDialog] = useState(false);
//   const [zainPayImage, setZainPayImage] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CardFormData>({
//     resolver: zodResolver(cardSchema),
//   });

//   const onSubmit: SubmitHandler<CardFormData> = (data) => {
//     setShowNewCardDialog(false);
//   };

//   return (
//     <div className="space-y-4 pt-4">
//       <h3 className="text-lg font-bold">Payment Method</h3>
//       <RadioGroup
//         value={paymentMethodValue}
//         onValueChange={(value) =>
//           setPaymentMethod?.(
//             paymentMethods.find((pm) => pm.id.toString() === value)?.name.en ||
//               "",
//             value
//           )
//         }
//         className="space-y-3"
//       >
//         {paymentMethods.map((pm, idx) => {
//           const disbaleWallet =
//             pm.name.en === "wallet" &&
//             Number(walletInfo?.wallet_balance) < Number(pharmacyData?.total);
//           return (
//             <label
//               key={pm.id}
//               className={`flex items-center gap-4 border border-border p-4 rounded-xl ${
//                 disbaleWallet
//                   ? "opacity-50 cursor-not-allowed"
//                   : "cursor-pointer"
//               }`}
//               onClick={() =>
//                 setSelectedPayment((prev) => pm.name.en || pm.name.ar)
//               }
//             >
//               <RadioGroupItem
//                 value={pm.id.toString()}
//                 disabled={disbaleWallet}
//               />
//               <div className="font-medium text-sm text-foreground">
//                 {pm.name.en || pm.name.ar}
//               </div>
//             </label>
//           );
//         })}
//       </RadioGroup>

//       {selectedPayment === "Card" && (
//         <div className="space-y-3">
//           <h4 className="text-base font-semibold pt-2">Saved Cards</h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {savedCards.map((card) => {
//               const isSelected = selectedCard === card.name;
//               const isExpired = card.expired;
//               return (
//                 <button
//                   key={card.name}
//                   type="button"
//                   onClick={() => !isExpired && setSelectedCard(card.name)}
//                   className={`flex items-center w-full gap-4 border p-4 rounded-xl transition-all duration-150 focus:outline-none relative
//                     ${
//                       isSelected && !isExpired
//                         ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary"
//                         : "border-border bg-background"
//                     }
//                     ${isExpired ? "opacity-60 cursor-not-allowed" : ""}`}
//                   aria-pressed={isSelected && !isExpired}
//                   disabled={isExpired}
//                 >
//                   {card.icon}
//                   {isExpired && (
//                     <span className=" bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-400">
//                       Expired
//                     </span>
//                   )}
//                   <div className="flex flex-col flex-1 text-left">
//                     <p className="text-base font-medium text-foreground">
//                       {card.name}
//                     </p>
//                     <p className="text-sm text-muted-foreground">{card.info}</p>
//                   </div>

//                   {isSelected && !isExpired && (
//                     <CheckCircle className="w-6 h-6 text-primary" />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//           <AddNewCardDialog
//             open={showNewCardDialog}
//             onOpenChange={setShowNewCardDialog}
//             onSubmit={onSubmit}
//             register={register}
//             errors={errors}
//             handleSubmit={handleSubmit}
//           />
//         </div>
//       )}

//       {selectedPayment === "Zain Pay" && (
//         <div className="space-y-4 pt-2">
//           <div className="text-sm text-muted-foreground">
//             Please transfer the payment to the following number:
//           </div>
//           <div className="font-medium text-lg text-foreground bg-muted p-3 rounded-md w-fit">
//             0912345678
//           </div>
//           <label
//             className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-teal-500 transition-colors dark:border-gray-600 dark:hover:border-teal-400"
//             onDrop={(e) => {
//               e.preventDefault();
//               const fileInput = e.currentTarget.querySelector(
//                 'input[type="file"]'
//               ) as HTMLInputElement;
//               if (
//                 e.dataTransfer.files &&
//                 e.dataTransfer.files.length > 0 &&
//                 fileInput
//               ) {
//                 fileInput.files = e.dataTransfer.files;
//                 const file = e.dataTransfer.files[0];
//                 if (file && file.type.startsWith("image/")) {
//                   const reader = new FileReader();
//                   reader.onload = (ev) => {
//                     setZainPayImage(ev.target?.result as string);
//                   };
//                   reader.readAsDataURL(file);
//                 }
//                 const event = new Event("change", { bubbles: true });
//                 fileInput.dispatchEvent(event);
//               }
//             }}
//             onDragOver={(e) => {
//               e.preventDefault();
//             }}
//           >
//             <div className="flex flex-col items-center gap-2">
//               {zainPayImage ? (
//                 <Image
//                   src={zainPayImage}
//                   alt="Transaction"
//                   width={96}
//                   height={96}
//                   className="h-24 w-auto rounded-md object-contain mb-2"
//                   style={{ objectFit: "contain" }}
//                 />
//               ) : (
//                 <>
//                   <Upload />
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     Drag & drop or click to upload transaction image
//                   </p>
//                 </>
//               )}
//             </div>
//             <Input
//               type="file"
//               className="hidden"
//               accept="image/*"
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file && file.type.startsWith("image/")) {
//                   const reader = new FileReader();
//                   reader.onload = (ev) => {
//                     setZainPayImage(ev.target?.result as string);
//                   };
//                   reader.readAsDataURL(file);
//                 } else {
//                   setZainPayImage(null);
//                 }
//               }}
//             />
//           </label>
//         </div>
//       )}

//       {/* {selectedPayment === "Cash on Delivery" && (
//         <div
//           className="bg-red-100 border-s-4 w-fit border-red-500 text-red-800 p-4 rounded-md mb-4 flex gap-2 items-center dark:bg-red-900 dark:border-red-400 dark:text-red-100"
//           style={{ marginTop: "2rem" }}
//         >
//           <Info className="w-6 h-6 mr-2 text-red-500 dark:text-red-300" />
//           <span className="text font-medium">
//             Cash on Delivery incurs an additional <b>cash handling fee</b> of{" "}
//             <b>20 LE</b>
//           </span>
//         </div>
//       )} */}
//       {selectedPayment === "Pay Later" && (
//         <div
//           className="bg-yellow-100 border-s-4 w-fit border-yellow-500 text-yellow-800 p-4 rounded-md mb-4 flex gap-2 items-center dark:bg-yellow-900 dark:border-yellow-400 dark:text-yellow-100"
//           style={{ marginTop: "2rem" }}
//         >
//           <Info className="w-6 h-6 mr-2 text-yellow-500 dark:text-yellow-300" />
//           <span className="text font-medium">
//             You have chosen <b>Pay Later</b>. You will pay for your order at a
//             later time as agreed.
//           </span>
//         </div>
//       )}
//       <div className="flex justify-end items-center gap-3 pt-4">
//         <ButtonStepNav handleClick={onBack}>
//           <ArrowLeft className="auto-dir" />
//           Back
//         </ButtonStepNav>

//         <ButtonStepNav handleClick={onNext}>
//           Next
//           <ArrowRight className="auto-dir" />
//         </ButtonStepNav>
//       </div>
//     </div>
//   );
// }


export default function order(){
  return(
    <h1>hello</h1>
  )
}