import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserPasswordSchema } from "@/lib/validators";
import { UpdateUserPasswordData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SpinnerMini from "../SpinnerMini";
import { updateUserPassword } from "@/lib/api/apiUser";
import { toast } from "sonner";

const ChangePassword = () => {
  const form = useForm<UpdateUserPasswordData>({
    resolver: zodResolver(updateUserPasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const [apiErrors, setApiErrors] = React.useState<string | null>(null);

  const onSubmit = async (data: UpdateUserPasswordData) => {
    // console.log(data);
    const response = await updateUserPassword(data);
    if (response?.success) {
      toast.success("Password updated successfully");
      form.reset();
      setApiErrors(null);
    } else {
      setApiErrors(
        response?.message || { general: "Failed to update password" }
      );
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
          كلمة المرور
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور القديمة *</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="كلمة المرور القديمة"
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
                <FormLabel>كلمة المرور الجديدة *</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="كلمة المرور الجديدة"
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
                <FormLabel>تأكيد كلمة المرور الجديدة *</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="كلمة المرور القديمة"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* API Errors Display */}
        {apiErrors && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mt-6">
            <ul className="space-y-1">
              <li className="text-sm text-destructive">
                <span className="font-bold capitalize">
                  {apiErrors.replace(/_/g, " ")}
                </span>{" "}
              </li>
            </ul>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {/* disabled={form.formState.isSubmitting}  */}
<Button disabled={true} type="submit">
            {form.formState.isSubmitting ? <SpinnerMini /> : " come soon"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChangePassword;
