# Refund Requests Page Documentation

## Overview

The Refund Requests page (`/account/refund`) displays a list of all refund requests submitted by the user with detailed information and status tracking.

## Location

**File**: `/app/(root)/account/refund/page.tsx`

**Route**: `/account/refund`

## Features

### 1. **Request Cards**

Each refund request is displayed as a card with:

- Request ID and Order Number
- Status badge with icon
- Total amount and refund amount
- Refund method indicator (Wallet badge if applicable)
- Reason preview (line-clamped to 2 lines)
- "View Details" button linking to `/account/refund/[id]`

### 2. **Status Indicators**

Visual status system with color-coded badges and icons:

- **Pending** (Yellow): Clock icon
- **Approved/Accepted** (Green): CheckCircle2 icon
- **Rejected/Declined** (Red): XCircle icon
- **Processing** (Blue): FileText icon
- **Refunded/Completed** (Teal): CheckCircle2 icon

### 3. **Dark/Light Mode Support**

- All colors have dark mode variants
- Uses theme-aware classes (e.g., `dark:bg-yellow-800`)
- Maintains readability in both themes

### 4. **Empty State**

When no refund requests exist:

- Large PackageOpen icon
- Informative message
- Call-to-action button to "View Orders"

### 5. **Error State**

Displays error card with:

- Alert icon
- Error message from API
- Red border for visual emphasis

## Data Structure

### ReturnedRequest Type

```typescript
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
```

## Status Color Mapping

```typescript
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "approved":
    case "accepted":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "rejected":
    case "declined":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    case "refunded":
    case "completed":
      return "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};
```

## UI Components Used

- **Card & CardContent**: Container for each request
- **Badge**: Status and refund method indicators
- **Button**: Action buttons (View Details, View Orders)
- **Icons** (lucide-react):
  - `FileText`: Processing status
  - `PackageOpen`: Empty state
  - `AlertCircle`: Error state and unknown status
  - `CheckCircle2`: Success states
  - `Clock`: Pending status
  - `XCircle`: Rejected status

## Layout Structure

```
<section>
  <div className="wrapper px-4">
    <div className="max-w-4xl mx-auto">

      <!-- Header -->
      <div>
        <h1>Refund Requests</h1>
        <p>Track and manage your refund requests</p>
      </div>

      <!-- Empty State OR Request Cards -->
      {requests.length === 0 ? (
        <Card>Empty State</Card>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <Card key={request.id}>
              <!-- Request Details -->
            </Card>
          ))}
        </div>
      )}

    </div>
  </div>
</section>
```

## Card Layout Breakdown

### Header Row

- Request ID + Status Badge
- Order Number
- Refunded Badge (conditional)

### Refund Details Grid

Two columns (responsive - stacks on mobile):

- **Column 1**: Total Amount
- **Column 2**: Refund Amount (highlighted in primary color)

### Refund Method

Conditional display if `refund_to_wallet` is true

### Reason Preview

- Gray background box
- Line-clamped to 2 lines
- Shows first part of return reason

### Action Button

- "View Details" button
- Links to `/account/refund/[id]`
- Rounded full style
- Hover effect

## Responsive Design

### Mobile (default)

- Single column layout
- Cards stack vertically
- Refund details grid stacks (1 column)

### Tablet/Desktop (sm breakpoint)

- Refund details grid shows 2 columns
- Cards maintain vertical stack
- Better spacing and padding

## Color Schemes

### Light Mode

- Background: White cards
- Text: Dark foreground
- Status badges: Light backgrounds with dark text
- Borders: Subtle gray borders

### Dark Mode

- Background: Dark cards
- Text: Light foreground
- Status badges: Dark backgrounds with light text
- Borders: Subtle light borders

## Integration with API

### API Call

```typescript
const response = await getReturnedRequests();
```

### Response Handling

1. Check `response.success`
2. If error, show error state
3. If success, display requests array
4. If empty array, show empty state

## Navigation

### Links

- **View Details**: `/account/refund/[id]`
- **View Orders**: `/account/orders` (from empty state)

## Server Component

This is a **Server Component** (async function):

- Fetches data on the server
- No client-side state management needed
- Fast initial page load
- SEO friendly

## Styling Patterns

### Consistent with App Style

- Uses `wrapper` class for container width
- Max width of `4xl` for content
- Padding pattern: `px-4 py-8`
- Rounded corners with `rounded-lg`
- Shadow on hover: `hover:shadow-lg`

### Theme Aware

All color utilities include dark mode variants:

```tsx
className = "text-foreground dark:text-foreground";
className = "bg-muted/50 dark:bg-muted/50";
className = "border-border dark:border-border";
```

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy (h1, h3)
- Icon + text for status badges
- Clear call-to-action buttons
- Keyboard navigable links
- Screen reader friendly text

## Future Enhancements

1. **Search & Filter**

   - Filter by status
   - Search by order number
   - Date range filter

2. **Sorting**

   - Sort by date
   - Sort by amount
   - Sort by status

3. **Pagination**

   - Load more button
   - Infinite scroll
   - Traditional pagination

4. **Status Timeline**

   - Visual timeline in card
   - Status change history

5. **Bulk Actions**

   - Select multiple requests
   - Cancel pending requests

6. **Export**

   - Download as PDF
   - Email report

7. **Notifications**
   - Status change alerts
   - Real-time updates

## Example Usage

The page is accessed through:

```
/account/refund
```

User flow:

1. User navigates to Refund Requests page
2. Sees list of all submitted requests
3. Clicks "View Details" on any request
4. Navigates to `/account/refund/[id]` for full details

## Testing Scenarios

1. **Empty State**: No refund requests exist
2. **Single Request**: One request with various statuses
3. **Multiple Requests**: List of requests
4. **Error State**: API returns error
5. **Dark Mode**: All elements visible and styled
6. **Mobile View**: Layout responsive and usable
7. **Long Reason Text**: Line clamp works correctly
8. **Wallet Refund**: Badge displays correctly
9. **Refunded Status**: Special badge appears

## Related Files

- `/lib/api/apiReturns.ts` - API functions
- `/types/index.ts` - Type definitions
- `/components/ui/*` - UI components
- `/account/refund/[id]/page.tsx` - Details page
