# Refund Request Details Page Documentation

## Overview

The Refund Request Details page (`/account/refund/[id]`) displays comprehensive information about a specific refund request, including returned items, status, notes, and financial details.

## Location

**File**: `/app/(root)/account/refund/[id]/page.tsx`

**Route**: `/account/refund/[id]`

**Type**: Server Component (read-only)

## Features

### 1. **Request Overview**

- Request ID and Order Number
- Current status with color-coded badge and icon
- Refunded indicator badge
- Back navigation to refund list

### 2. **Financial Summary**

Three-column grid displaying:

- **Total Amount**: Original order amount
- **Refund Amount**: Amount to be refunded (highlighted in primary color)
- **Refund Method**: Wallet or Original payment method with icon

### 3. **Notes Section**

- **Return Reason**: Customer's explanation for the return
- **Platform Notes**: Optional notes from platform team (blue theme)
- **Pharmacy Notes**: Optional notes from pharmacy (purple theme)

### 4. **Returned Items Table**

Desktop view (md+):

- Product ID
- Proof image (if provided)
- Quantity returned vs original quantity
- Unit price and total price
- Item approval status

Mobile view (<md):

- Card-based layout
- All information reorganized for mobile
- Stacked layout for better readability

## Data Structure

### ReturnRequestDetails Type

```typescript
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
```

Inherits from `ReturnedRequest`:

```typescript
{
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
}
```

## API Integration

### Function: `getReturnRequestDetails`

**File**: `/lib/api/apiReturns.ts`

```typescript
export async function getReturnRequestDetails(
  requestId: string,
  userToken?: string
) {
  // Authenticates user
  // Fetches from: GET /returns/{requestId}
  // Returns ReturnRequestDetails
}
```

**Response Handling**:

- Success: Displays full request details
- Error: Returns `notFound()` (404 page)

## Layout Structure

```
<section>
  <div className="wrapper px-4">
    <div className="max-w-5xl mx-auto">

      <!-- Back Button -->
      <Button>← Back to Refund Requests</Button>

      <!-- Header Card -->
      <Card>
        <CardHeader>
          Request #123 [Status Badge] [Refunded Badge]
          Order #456789
        </CardHeader>
        <CardContent>
          <!-- Financial Summary Grid -->
          <!-- Return Reason -->
          <!-- Platform Notes (conditional) -->
          <!-- Pharmacy Notes (conditional) -->
        </CardContent>
      </Card>

      <!-- Items Card -->
      <Card>
        <CardHeader>Returned Items</CardHeader>
        <CardContent>
          <!-- Desktop: Table -->
          <!-- Mobile: Cards -->
        </CardContent>
      </Card>

    </div>
  </div>
</section>
```

## Visual Components

### Status Badge System

Uses the same status color/icon system as the list page:

- pending → Yellow, Clock
- platform_received → Blue, PackageOpen
- pharmacy_pending → Orange, Clock
- pharmacy_received → Indigo, PackageOpen
- approved → Green, CheckCircle2
- rejected → Red, XCircle
- refunded → Teal, CheckCircle2

### Item Approval Status

- **Approved**: Green badge with checkmark
- **Pending**: Yellow badge with clock

### Financial Display

```
┌─────────────────────────────────────────┐
│ Total Amount     Refund Amount   Method │
│ 150.00 EGP       150.00 EGP      Wallet │
└─────────────────────────────────────────┘
```

### Notes Display

Color-coded sections with icons:

- **Return Reason**: Gray background, FileText icon
- **Platform Notes**: Blue background/border, AlertTriangle icon
- **Pharmacy Notes**: Purple background/border, AlertTriangle icon

## Responsive Design

### Desktop (md+)

- Full-width table for items
- 3-column financial summary
- Side-by-side layout where applicable

### Mobile (<md)

- Stacked card layout for items
- Single-column financial summary
- All information remains accessible
- Optimized touch targets

## Image Handling

### Proof Images

- **With Image**: Display 12x12 thumbnail (desktop), 24x24 (mobile)
- **Without Image**: Dashed border placeholder with ImageIcon
- Uses Next.js Image component for optimization

## Color Themes

### Light Mode

- Card backgrounds: White
- Text: Dark foreground
- Notes: Colored backgrounds (blue-50, purple-50)
- Borders: Subtle gray

### Dark Mode

- Card backgrounds: Dark
- Text: Light foreground
- Notes: Dark colored backgrounds (blue-950, purple-950)
- Borders: Subtle light borders
- All status badges optimized for dark mode

## Navigation

### Links

- **Back Button**: `/account/refund`
- From List Page: `/account/refund/[id]`

### Route Parameters

- `params.id`: Refund request ID

## Icons Used

| Purpose           | Icon                                      | Source       |
| ----------------- | ----------------------------------------- | ------------ |
| Back navigation   | ArrowLeft                                 | lucide-react |
| Status indicators | Clock, PackageOpen, CheckCircle2, XCircle | lucide-react |
| Sections          | FileText, Package, Wallet, AlertTriangle  | lucide-react |
| Image placeholder | ImageIcon                                 | lucide-react |

## Error Handling

### Not Found (404)

```typescript
if (!response?.success || !response.data) {
  notFound();
}
```

Triggers Next.js 404 page when:

- Request ID doesn't exist
- User doesn't have access
- API returns error

### API Errors

Handled at API level with proper error messages

## Server Component Benefits

- ✅ No client-side JavaScript needed
- ✅ Faster initial page load
- ✅ SEO-friendly (fully rendered HTML)
- ✅ Reduced bundle size
- ✅ Direct database/API access
- ✅ No loading states needed (server-side)

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy (h1, h2, h3)
- Icon + text for all status indicators
- Keyboard navigable links
- Screen reader friendly
- Color is not the only information indicator
- Alt text for images

## Security

- Server-side authentication via `getAuthToken`
- User can only access their own requests
- No sensitive data exposed to client
- Protected API routes

## Example Data Flow

```
1. User clicks "View Details" on request #123
   ↓
2. Navigation to /account/refund/123
   ↓
3. Server fetches data: getReturnRequestDetails("123")
   ↓
4. API validates user token
   ↓
5. Server renders full HTML with data
   ↓
6. User sees complete details page
```

## Component Tree

```
RefundRequestDetailsPage (Server)
├── Button (Back navigation)
├── Card (Header)
│   ├── CardHeader
│   │   ├── Title + Status Badge
│   │   └── Refunded Badge (conditional)
│   └── CardContent
│       ├── Financial Summary Grid
│       ├── Return Reason Section
│       ├── Platform Notes (conditional)
│       └── Pharmacy Notes (conditional)
└── Card (Items)
    ├── CardHeader (Title)
    └── CardContent
        ├── Table (Desktop view)
        └── Cards (Mobile view)
```

## Styling Patterns

### Consistent with App

- Uses `wrapper` class for container
- Max width: `5xl` (larger than list for table)
- Padding: `px-4 py-8`
- Card-based layout
- Rounded corners
- Shadow effects

### Color Coding

- **Primary**: Refund amounts
- **Muted**: Secondary information
- **Foreground**: Main text
- **Destructive**: Rejected status
- **Success**: Approved items

## Performance Optimizations

1. **Server Rendering**: No client-side hydration needed
2. **Image Optimization**: Next.js Image component
3. **Code Splitting**: Automatic with Next.js App Router
4. **Static Assets**: Icons loaded from lucide-react bundle

## Testing Checklist

- [ ] Request loads correctly with valid ID
- [ ] 404 page shows for invalid ID
- [ ] All status types display correctly
- [ ] Financial summary calculates properly
- [ ] Notes sections show when data exists
- [ ] Notes sections hide when null
- [ ] Items table displays all columns
- [ ] Mobile view renders correctly
- [ ] Images display with fallback
- [ ] Refunded badge shows when is_refunded=true
- [ ] Refund method displays correctly
- [ ] Dark mode renders properly
- [ ] Back button navigates correctly
- [ ] Responsive breakpoints work
- [ ] Item approval status shows correctly

## Future Enhancements

1. **Status Timeline**

   - Visual timeline of status changes
   - Timestamp for each status

2. **Download Receipt**

   - PDF export of refund details
   - Email receipt option

3. **Real-time Updates**

   - WebSocket integration
   - Auto-refresh on status change

4. **Comments Section**

   - User can add follow-up comments
   - Platform/pharmacy can respond

5. **Print View**

   - Optimized print stylesheet
   - Print button

6. **Share Link**

   - Shareable link to support team
   - Temporary access token

7. **Related Order Details**

   - Link to original order
   - Quick order summary

8. **Refund Tracking**

   - Estimated refund date
   - Processing timeline

9. **Evidence Upload**

   - Add more images after submission
   - Document attachments

10. **Multi-language Support**
    - Arabic translations
    - Language switcher

## Related Files

- `/app/(root)/account/refund/page.tsx` - List page
- `/lib/api/apiReturns.ts` - API functions
- `/types/index.ts` - Type definitions
- `/components/ui/*` - UI components
- `/docs/REFUND-STATUS-SYSTEM.md` - Status reference

## Usage Example

```typescript
// Automatic routing from list page
<Link href={`/account/refund/${request.id}`}>View Details</Link>

// Direct URL access
// https://yoursite.com/account/refund/123
```

## Notes

- Read-only view (no edit functionality)
- Server component for better performance
- Fully themed (light/dark mode)
- Mobile-first responsive design
- Type-safe with TypeScript
- Uses Next.js 15 App Router conventions
