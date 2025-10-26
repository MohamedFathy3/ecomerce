# Refund Request Dialog - Feature Documentation

## Overview

The Refund Request Dialog allows users to request refunds for specific items from their orders with the ability to specify the quantity to return for each item.

## Features

### 1. **Quantity Selection**

- Users can specify how many units of each item they want to return
- Quantity selector with increment/decrement buttons
- Direct input field for typing quantity
- Validation: Quantity must be between 1 and the original purchased quantity
- Visual feedback showing purchased quantity vs. return quantity

### 2. **Dynamic Price Calculation**

- Refund amount automatically calculated based on selected quantity
- Shows unit price for each item
- Displays individual refund amount per item
- Total estimated refund calculated across all items

### 3. **Image Upload (Optional)**

- Users can upload proof images for each item
- Support for common image formats (jpg, jpeg, png, gif, webp)
- Maximum file size: 5MB
- Image preview with ability to remove
- Drag-and-drop or click to upload

### 4. **Type-Safe Implementation**

- Uses the `ReturnRequest` type for proper data structure
- Ensures compatibility with backend API expectations

## Data Structure

### ReturnRequest Type

```typescript
export type ItemToReturn = {
  order_item_id: number;
  quantity: number;
  image: Record<number, { file: File; preview: string }>;
};

export type ReturnRequest = {
  order_id: string;
  return_reason: string;
  items: ItemToReturn[];
};
```

### Submitted Data Format

When the user submits the refund request, the data is structured as:

```typescript
{
  order_id: "12345",
  return_reason: "Product damaged during shipping",
  items: [
    {
      order_item_id: 1,
      quantity: 2,  // Returning 2 out of 5 purchased
      image: {
        1: {
          file: File,  // The uploaded file
          preview: "data:image/png;base64,..."  // Preview URL
        }
      }
    },
    // ... more items
  ]
}
```

## UI Components

### Quantity Selector

- **Decrement Button**: Reduces quantity by 1 (disabled at quantity = 1)
- **Input Field**: Allows direct numeric input (width: 80px)
- **Increment Button**: Increases quantity by 1 (disabled at max purchased quantity)

### Item Card Display

Each item card shows:

1. **Product Name**: Item title
2. **Purchased Quantity**: Original order quantity with package icon
3. **Quantity Selector**: Controls for return quantity
4. **Unit Price**: Price per single unit
5. **Refund Amount**: Calculated refund (quantity × unit price)
6. **Image Upload**: Optional proof upload area
7. **Remove Button**: Remove item from refund request

### Refund Summary

Located at the bottom:

- **Subtotal**: Sum of all return amounts
- **Estimated Refund**: Total refund amount (currently same as subtotal)

## User Flow

1. **Add Items**: User adds items to refund from order details page
2. **Open Dialog**: Refund Request Dialog opens with selected items
3. **Adjust Quantities**:
   - For each item, user can adjust quantity to return
   - Refund amount updates in real-time
4. **Upload Proof** (Optional):
   - Click or drag image to upload
   - Preview uploaded image
   - Remove and re-upload if needed
5. **Enter Reason**: Required text field for refund justification
6. **Review**: Check refund summary
7. **Submit**: Click "Submit Refund Request"

## Validation Rules

### Quantity Validation

- Minimum: 1 unit
- Maximum: Original purchased quantity
- Must be an integer
- Auto-clamps to valid range if user enters invalid value

### Form Validation

- At least 1 item must be selected
- Refund reason is required (must have content after trimming)
- Submit button disabled if validation fails

### Image Validation

- Optional for each item
- Max file size: 5MB
- Accepted formats: image/\*, .jpg, .jpeg, .png, .gif, .webp
- One image per item

## State Management

The component manages the following state:

```typescript
const [reason, setReason] = useState("");
const [itemImages, setItemImages] = useState<
  Record<number, { file: File; preview: string }>
>({});
const [itemQuantities, setItemQuantities] = useState<Record<number, number>>(
  {}
);
```

- **reason**: Text input for refund justification
- **itemImages**: Map of product_id to uploaded image data
- **itemQuantities**: Map of product_id to selected return quantity

## Props

```typescript
interface RefundRequestDialogProps {
  open: boolean; // Control dialog visibility
  onOpenChange: (open: boolean) => void; // Callback for close
  items: OrderDetailsItem[]; // Items available for refund
  orderId: number; // Order ID for the request
  onRemoveItem: (item: OrderDetailsItem) => void; // Remove item callback
  currency?: string; // Currency code (default: "EGP")
  onSubmitSuccess?: () => void; // Success callback
}
```

## Calculation Logic

### Individual Item Refund

```typescript
const calculateItemTotal = (item: OrderDetailsItem) => {
  const returnQty = itemQuantities[item.product_id] || item.quantity;
  const unitPrice = Number(item.unit_price);
  return returnQty * unitPrice;
};
```

### Total Refund Amount

```typescript
const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
```

## Integration Points

### API Integration (TODO)

The `handleSubmit` function is ready for API integration:

```typescript
const handleSubmit = async () => {
  const returnRequest: ReturnRequest = {
    order_id: orderId.toString(),
    return_reason: reason,
    items: items.map((item) => ({
      order_item_id: item.id,
      quantity: itemQuantities[item.product_id] || item.quantity,
      image: itemImages[item.product_id]
        ? { [item.product_id]: itemImages[item.product_id] }
        : {},
    })),
  };

  // TODO: Implement API call
  console.log("Submitting return request:", returnRequest);

  // Call success callback
  if (onSubmitSuccess) {
    onSubmitSuccess();
  }

  onOpenChange(false);
};
```

### Required API Endpoint

- **Endpoint**: `POST /api/orders/{orderId}/returns`
- **Body**: `ReturnRequest` object
- **Content-Type**: `multipart/form-data` (for image uploads)

## Example Usage

```tsx
import RefundRequestDialog from "@/components/custom/order/RefundRequestDialog";

function OrderDetailsPage() {
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [itemsToRefund, setItemsToRefund] = useState<OrderDetailsItem[]>([]);

  return (
    <>
      {/* Your order details UI */}

      <RefundRequestDialog
        open={isRefundDialogOpen}
        onOpenChange={setIsRefundDialogOpen}
        items={itemsToRefund}
        orderId={orderId}
        onRemoveItem={(item) => {
          setItemsToRefund((prev) =>
            prev.filter((i) => i.product_id !== item.product_id)
          );
        }}
        currency="EGP"
        onSubmitSuccess={() => {
          // Clear selected items, show success message, etc.
          setItemsToRefund([]);
        }}
      />
    </>
  );
}
```

## Accessibility

- All interactive elements are keyboard accessible
- Quantity input accepts keyboard input
- Buttons have proper disabled states
- Form validation prevents invalid submissions
- Visual feedback for all states (disabled, hover, active)

## Responsive Design

- **Mobile**: Single column layout
- **Tablet (md)**: 2 columns
- **Desktop (lg)**: 3 columns
- Dialog scrolls when content exceeds viewport height
- Maximum height: 90vh with overflow scroll

## Future Enhancements

1. **API Integration**: Connect to backend refund API
2. **Loading States**: Add loading indicator during submission
3. **Error Handling**: Display API errors to user
4. **Success Confirmation**: Show success message/toast after submission
5. **Refund Policy**: Display terms and conditions
6. **Processing Time**: Show estimated refund processing time
7. **Return Shipping**: Add shipping method selection if needed
8. **Partial Refund Reasons**: Different reasons per item
9. **Image Gallery**: Multiple images per item
10. **Order History Integration**: Track refund status in order history

## Notes

- The dialog maintains selected items in localStorage (handled by parent component)
- Quantities are initialized when items are added to the dialog
- Image previews use FileReader API for client-side display
- All currency formatting uses the `formatCurrency` utility function
- Component is fully typed with TypeScript for type safety
