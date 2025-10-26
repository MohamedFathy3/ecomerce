"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { plan, PlanSubscriptionFormData } from "@/types";
import { planSubscriptionFormSchema } from "@/lib/validators";
import { Badge } from "@/components/ui/badge";
import { Building2, CreditCard, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { subscribeToPlan } from "@/lib/api/apiPlans";

interface PlanSubscriptionModalProps {
  plan: plan;
  isOpen: boolean;
  onClose: () => void;
}

const PlanSubscriptionModal = ({
  plan,
  isOpen,
  onClose,
}: PlanSubscriptionModalProps) => {
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  const form = useForm<PlanSubscriptionFormData>({
    resolver: zodResolver(planSubscriptionFormSchema),
    defaultValues: {
      plan_id: plan.id,
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      pharmacy_name_ar: "",
      pharmacy_name_en: "",
      pharmacy_address_ar: "",
      pharmacy_address_en: "",
      pharmacy_phone: "",
      pharmacy_email: "",
      payment_method: "card",
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        plan_id: plan.id,
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        pharmacy_name_ar: "",
        pharmacy_name_en: "",
        pharmacy_address_ar: "",
        pharmacy_address_en: "",
        pharmacy_phone: "",
        pharmacy_email: "",
        payment_method: "card",
      });
      setApiErrors({}); // Clear API errors when modal opens
    }
  }, [isOpen, plan.id, form]);

  const onSubmit = async (data: PlanSubscriptionFormData) => {
    try {
      setApiErrors({}); // Clear previous errors
      const response = await subscribeToPlan(data);
      console.log(response);
      if (response.success) {
        toast.success("Subscription successful! Welcome aboard! 🎉");
        form.reset();
        onClose();
      } else {
        setApiErrors(response.message);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" !w-11/12 !max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Subscribe to{" "}
            {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)} Plan
          </DialogTitle>
          <DialogDescription>
            Fill in your details to complete your subscription
          </DialogDescription>
        </DialogHeader>

        {/* Plan Summary */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-lg capitalize">
                {plan.type} Plan
              </h4>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {plan.price} {plan.currency}
              </div>
              <Badge variant="secondary" className="mt-1">
                {plan.duration_in_days} days
              </Badge>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+201234567890"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Min. 8 characters"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Re-enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Pharmacy Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Pharmacy Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pharmacy_name_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy Name (Arabic) *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="صيدلية النور"
                          dir="rtl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pharmacy_name_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy Name (English) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Al-Noor Pharmacy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pharmacy_address_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (Arabic) *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="القاهرة - مدينة نصر"
                          dir="rtl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pharmacy_address_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (English) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Cairo - Nasr City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pharmacy_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy Phone *</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+209876543210"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pharmacy_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="pharmacy@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Method
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="card">
                            Credit/Debit Card
                          </SelectItem>
                          <SelectItem value="cash">Cash on Delivery</SelectItem>
                          <SelectItem value="wallet">Digital Wallet</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* API Errors Display */}
            {Object.keys(apiErrors).length > 0 && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                <ul className="space-y-1">
                  {Object.entries(apiErrors).map(([field, messages]) => {
                    const errorText = Array.isArray(messages)
                      ? messages.join(", ")
                      : String(messages);
                    return (
                      <li key={field} className="text-sm text-destructive">
                        <span className="font-bold capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {errorText}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Processing..."
                  : "Subscribe Now"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanSubscriptionModal;
