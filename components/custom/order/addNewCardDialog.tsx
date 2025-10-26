import { Checkbox } from "@/components/ui/checkbox";
import { CardFormData } from "@/types";
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type AddNewCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitHandler<CardFormData>;
  register: UseFormRegister<CardFormData>;
  errors: FieldErrors<CardFormData>;
  handleSubmit: UseFormHandleSubmit<CardFormData>;
};

export default function AddNewCardDialog({
  open,
  onOpenChange,
  onSubmit,
  register,
  errors,
  handleSubmit,
}: AddNewCardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="block mx-auto">
          Add New Card
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <Input placeholder="Cardholder Name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}

          <Input
            placeholder="Card Number"
            {...register("number")}
            inputMode="numeric"
            maxLength={19}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");
              value = value.match(/.{1,4}/g)?.join(" ") || "";
              e.target.value = value;
            }}
          />
          {errors.number && (
            <p className="text-sm text-red-500">{errors.number.message}</p>
          )}

          <div className="flex gap-4">
            <Input
              placeholder="Expiry Date (MM/YY)"
              {...register("expiry")}
              maxLength={5}
              inputMode="numeric"
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 4) value = value.slice(0, 4);
                let month = value.slice(0, 2);
                const year = value.slice(2);
                if (month.length === 2) {
                  const monthNum = parseInt(month, 10);
                  if (monthNum < 1 || monthNum > 12) month = "12";
                }
                e.target.value = value.length > 2 ? month + "/" + year : month;
              }}
            />
            <Input
              placeholder="CVV"
              {...register("cvv")}
              maxLength={4}
              inputMode="numeric"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
              }}
            />
          </div>
          {errors.expiry && (
            <p className="text-sm text-red-500">{errors.expiry.message}</p>
          )}
          {errors.cvv && (
            <p className="text-sm text-red-500">{errors.cvv.message}</p>
          )}

          <div className="flex items-center gap-2">
            <Checkbox id="setDefault" {...register("setDefault")} />
            <label htmlFor="setDefault" className="text-sm">
              Set as default
            </label>
          </div>

          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
