import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState, useTransition } from "react";
import StarRating from "../starRating";
import { Cart, OrderDetailsItem } from "@/types";
import { CartItem } from "@/types";
import { rateProduct } from "@/lib/api/apiProducts";
import { toast } from "sonner";
import { CheckCircle, OctagonX } from "lucide-react";
import SpinnerMini from "../SpinnerMini";

const RatingDialog = ({
  item,
  userToken,
}: {
  item: OrderDetailsItem;
  userToken: string;
}) => {
  const [ratings, setRatings] = useState<number>(0);
  const [comments, setComments] = useState<string>("");
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setRatings(0);
    setComments("");
    setErrors({});
    setOpen(false);
  };

  const handleRateSubmit = () => {
    setErrors({}); // Reset errors
    if (ratings <= 0) {
      setErrors((prev) => ({
        ...prev,
        ratings: "Please select a rating",
      }));
      return;
    }
    if (comments.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        comments: "Please add a comment",
      }));
      return;
    }
    startTransition(async () => {
      const response = await rateProduct(
        item.product_id.toString(),
        { rate: ratings, rate_text: comments },
        userToken
      );
      if (response.success) {
        toast(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Thank you for your feedback!</span>
          </div>
        );
        handleClose();
      } else {
        toast(
          <div className="flex items-center gap-2">
            <OctagonX className="h-4 w-4 text-red-500" />
            <span>Failed to submit feedback. Please try again.</span>
          </div>
        );
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="sm"
          className="rounded-full bg-muted"
        >
          Rate
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-secondary">
        <DialogTitle>Rate {item.product_name}</DialogTitle>
        <div className="flex-center">
          <StarRating
            readOnly={false}
            value={ratings}
            onChange={(v) => setRatings(v)}
          />
        </div>
        {errors.ratings && (
          <p className="text-red-500 text-sm mt-2">{errors.ratings}</p>
        )}
        <textarea
          placeholder="Add a comment"
          className="w-full mt-4 p-2 border rounded"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        {errors.comments && (
          <p className="text-red-500 text-sm mt-2">{errors.comments}</p>
        )}

        <Button className="mt-4" onClick={handleRateSubmit}>
          {pending ? <SpinnerMini /> : "Submit Rating"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
