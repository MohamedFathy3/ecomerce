# Refund Request Status System

## Overview

This document describes the status workflow and visual representation for refund requests in the system.

## Status Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Refund Request Lifecycle                     │
└─────────────────────────────────────────────────────────────────┘

1. pending                → Initial submission by customer
   ↓
2. platform_received      → Platform acknowledges receipt
   ↓
3. pharmacy_pending       → Waiting for pharmacy review
   ↓
4. pharmacy_received      → Pharmacy acknowledges receipt
   ↓
5a. approved             → Request approved
    ↓
    refunded             → Money refunded to customer

5b. rejected             → Request denied (terminal state)
```

## Status Definitions

### 1. **pending**

- **Meaning**: Initial state when customer submits refund request
- **Description**: Request is awaiting platform review
- **Color**: Yellow
- **Icon**: Clock ⏰
- **User Action**: Wait for platform response

### 2. **platform_received**

- **Meaning**: Platform has acknowledged the refund request
- **Description**: Request is being processed by platform team
- **Color**: Blue
- **Icon**: PackageOpen 📦
- **User Action**: Wait for forwarding to pharmacy

### 3. **pharmacy_pending**

- **Meaning**: Request forwarded to pharmacy, awaiting their review
- **Description**: Pharmacy needs to review and accept the return
- **Color**: Orange
- **Icon**: Clock ⏰
- **User Action**: Wait for pharmacy to receive items

### 4. **pharmacy_received**

- **Meaning**: Pharmacy has received the returned items
- **Description**: Items are being inspected by pharmacy
- **Color**: Indigo/Purple
- **Icon**: PackageOpen 📦
- **User Action**: Wait for final decision

### 5. **approved**

- **Meaning**: Refund request has been approved
- **Description**: Refund will be processed soon
- **Color**: Green
- **Icon**: CheckCircle ✓
- **User Action**: Wait for refund processing

### 6. **rejected**

- **Meaning**: Refund request has been denied
- **Description**: Request cannot be fulfilled (see notes for reason)
- **Color**: Red
- **Icon**: XCircle ✗
- **User Action**: Review rejection reason in notes
- **Terminal State**: Yes

### 7. **refunded**

- **Meaning**: Money has been returned to customer
- **Description**: Refund process complete
- **Color**: Teal/Cyan
- **Icon**: CheckCircle ✓
- **User Action**: Check wallet/payment method
- **Terminal State**: Yes

## Visual Representation

### Color Scheme

| Status                | Light Mode                      | Dark Mode                       |
| --------------------- | ------------------------------- | ------------------------------- |
| **pending**           | `bg-yellow-100 text-yellow-800` | `bg-yellow-900 text-yellow-100` |
| **platform_received** | `bg-blue-100 text-blue-800`     | `bg-blue-900 text-blue-100`     |
| **pharmacy_pending**  | `bg-orange-100 text-orange-800` | `bg-orange-900 text-orange-100` |
| **pharmacy_received** | `bg-indigo-100 text-indigo-800` | `bg-indigo-900 text-indigo-100` |
| **approved**          | `bg-green-100 text-green-800`   | `bg-green-900 text-green-100`   |
| **rejected**          | `bg-red-100 text-red-800`       | `bg-red-900 text-red-100`       |
| **refunded**          | `bg-teal-100 text-teal-800`     | `bg-teal-900 text-teal-100`     |

### Icons

| Status                | Icon | Component          |
| --------------------- | ---- | ------------------ |
| **pending**           | ⏰   | `<Clock />`        |
| **platform_received** | 📦   | `<PackageOpen />`  |
| **pharmacy_pending**  | ⏰   | `<Clock />`        |
| **pharmacy_received** | 📦   | `<PackageOpen />`  |
| **approved**          | ✓    | `<CheckCircle2 />` |
| **rejected**          | ✗    | `<XCircle />`      |
| **refunded**          | ✓    | `<CheckCircle2 />` |

## Implementation

### Status Color Function

```typescript
const getStatusColor = (status: string) => {
  switch (status.toLowerCase().replace(/\s+/g, "_")) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    case "platform_received":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    case "pharmacy_pending":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
    case "pharmacy_received":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100";
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    case "refunded":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};
```

### Status Icon Function

```typescript
const getStatusIcon = (status: string) => {
  switch (status.toLowerCase().replace(/\s+/g, "_")) {
    case "pending":
    case "pharmacy_pending":
      return <Clock className="h-4 w-4" />;
    case "platform_received":
    case "pharmacy_received":
      return <PackageOpen className="h-4 w-4" />;
    case "approved":
      return <CheckCircle2 className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    case "refunded":
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};
```

## Status Display Examples

### Badge Component

```tsx
<Badge className={getStatusColor(request.status)}>
  <span className="flex items-center gap-1">
    {getStatusIcon(request.status)}
    <span className="capitalize">{request.status.replace(/_/g, " ")}</span>
  </span>
</Badge>
```

### Visual Examples

#### Pending

```
[⏰ Pending]  (Yellow background)
```

#### Platform Received

```
[📦 Platform Received]  (Blue background)
```

#### Pharmacy Pending

```
[⏰ Pharmacy Pending]  (Orange background)
```

#### Pharmacy Received

```
[📦 Pharmacy Received]  (Indigo background)
```

#### Approved

```
[✓ Approved]  (Green background)
```

#### Rejected

```
[✗ Rejected]  (Red background)
```

#### Refunded

```
[✓ Refunded]  (Teal background)
```

## Status Transitions

### Valid Transitions

| From                | To                  | Trigger                  |
| ------------------- | ------------------- | ------------------------ |
| `pending`           | `platform_received` | Platform accepts request |
| `platform_received` | `pharmacy_pending`  | Forward to pharmacy      |
| `platform_received` | `rejected`          | Platform rejects         |
| `pharmacy_pending`  | `pharmacy_received` | Pharmacy receives items  |
| `pharmacy_pending`  | `rejected`          | Pharmacy rejects         |
| `pharmacy_received` | `approved`          | Pharmacy approves        |
| `pharmacy_received` | `rejected`          | Pharmacy rejects         |
| `approved`          | `refunded`          | Refund processed         |

### Invalid Transitions

- `refunded` → Any status (terminal)
- `rejected` → Any status (terminal)
- Any backward transitions (no status rollback)

## Customer Communication

### Status Change Messages

| Status              | Customer Message                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `pending`           | "Your refund request has been submitted and is awaiting review."                             |
| `platform_received` | "Your refund request has been received and is being processed."                              |
| `pharmacy_pending`  | "Your refund request has been forwarded to the pharmacy for review."                         |
| `pharmacy_received` | "The pharmacy has received your returned items and is inspecting them."                      |
| `approved`          | "Great news! Your refund request has been approved and will be processed soon."              |
| `rejected`          | "Unfortunately, your refund request has been rejected. Please check the notes for details."  |
| `refunded`          | "Your refund has been processed successfully. The amount has been credited to your account." |

## Backend Reference

### Database Values

The status field stores these exact values:

```php
<option value="pending">Pending</option>
<option value="platform_received">platform received</option>
<option value="pharmacy_pending">pharmacy pending</option>
<option value="pharmacy_received">pharmacy received</option>
<option value="approved">Approved</option>
<option value="rejected">Rejected</option>
<option value="refunded">refunded</option>
```

**Note**: Frontend normalizes these values using `.toLowerCase().replace(/\s+/g, "_")` to handle:

- Case variations (Pending vs pending)
- Space variations (platform received vs platform_received)

## User Experience Guidelines

### Status Indicators

1. **Always show icon + text** for better comprehension
2. **Use consistent colors** across light/dark modes
3. **Capitalize first letter** of status names for display
4. **Replace underscores with spaces** for readability

### Timeline View

Consider showing status timeline on detail page:

```
✓ Pending (Jan 1, 2025)
✓ Platform Received (Jan 2, 2025)
✓ Pharmacy Pending (Jan 3, 2025)
⏰ Pharmacy Received (Jan 4, 2025) ← Current
○ Approved
○ Refunded
```

### Error States

If status value doesn't match any case:

- Show gray badge with AlertCircle icon
- Display raw status text
- Log warning for investigation

## Accessibility

- **Color is not the only indicator**: Each status has an icon
- **Text labels**: Status names are displayed, not just colors
- **Screen readers**: Icons have aria-labels
- **Keyboard navigation**: All status badges are accessible

## Testing Checklist

- [ ] All 7 statuses display correctly in light mode
- [ ] All 7 statuses display correctly in dark mode
- [ ] Icons match status meanings
- [ ] Colors are distinguishable from each other
- [ ] Status names format correctly (spaces, capitalization)
- [ ] Unknown statuses show default gray badge
- [ ] Badge fits well in card layout
- [ ] Mobile view displays properly
- [ ] Accessibility tests pass

## Related Files

- `/app/(root)/account/refund/page.tsx` - Status list view
- `/app/(root)/account/refund/[id]/page.tsx` - Status detail view
- `/types/index.ts` - ReturnedRequest type definition
- `/lib/api/apiReturns.ts` - API functions
