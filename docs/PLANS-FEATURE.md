# Plans & Subscription Feature

## Overview

A complete subscription management system for pharmacy plans with a modern, professional UI that supports both light and dark modes.

## Features

### 🎨 UI/UX

- **Modern Card-Based Layout** - Responsive grid displaying plan cards (1/2/3 columns)
- **Default Plan Highlighting** - Most popular plan is visually emphasized with a "Most Popular" badge
- **Dark Mode Support** - Full support for light and dark themes
- **Loading States** - Skeleton screens during data fetching
- **Error Handling** - User-friendly error messages with fallback to mock data

### 📋 Plan Display

Each plan card shows:

- Plan icon (dynamic based on type)
- Plan type (Monthly, Annual, Quarterly)
- Description
- Total price and monthly breakdown
- Duration in days
- List of features
- Subscribe button

### 📝 Subscription Modal

Professional multi-step form with:

#### Personal Information

- Full Name
- Email
- Phone
- Password
- Password Confirmation

#### Pharmacy Information

- Pharmacy Name (Arabic & English)
- Pharmacy Address (Arabic & English)
- Pharmacy Phone
- Pharmacy Email

### ✅ Validation

- **Zod Schema Validation** - Complete form validation using `planSubscriptionFormSchema`
- **Real-time Error Display** - Instant feedback with toast notifications
- **Server-side Validation** - Handles 422 validation errors from API

## File Structure

```
app/(root)/plans/
├── page.tsx                    # Main plans page
└── loading.tsx                 # Loading skeleton

components/custom/plans/
└── PlanSubscriptionModal.tsx   # Subscription form modal

lib/
├── api/
│   └── apiPlans.ts            # API functions for plans
└── validators.ts              # Zod schemas including planSubscriptionFormSchema

types/
└── index.ts                   # TypeScript types (plan, PlanSubscriptionFormData)
```

## API Endpoints

### `GET /plans`

Fetches all available plans.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "monthly",
      "description": "Perfect for small pharmacies",
      "price": "299",
      "currency": "EGP",
      "duration_in_days": 30,
      "is_default": false,
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### `POST /plans/subscribe`

Submits a plan subscription.

**Request Body:**

```json
{
  "plan_id": 1,
  "name": "Ahmed Othman",
  "email": "ahmed@example.com",
  "phone": "+201234567890",
  "password": "securepassword",
  "password_confirmation": "securepassword",
  "pharmacy_name_ar": "صيدلية النور",
  "pharmacy_name_en": "Al-Noor Pharmacy",
  "pharmacy_address_ar": "القاهرة - مدينة نصر",
  "pharmacy_address_en": "Cairo - Nasr City",
  "pharmacy_phone": "+209876543210",
  "pharmacy_email": "pharmacy@example.com"
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Subscription successful",
  "data": {
    /* subscription details */
  }
}
```

**Error Response (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."],
    "phone": ["The phone format is invalid."]
  }
}
```

## Usage

### Basic Page Access

Navigate to `/plans` to view all available subscription plans.

### Subscribing to a Plan

1. Click "Subscribe Now" on any plan card
2. Fill in the subscription form with:
   - Personal details
   - Pharmacy information
3. Click "Subscribe Now"
4. Receive confirmation toast notification

### Customization

#### Adding New Plan Features

Edit the `planFeatures` object in `/app/(root)/plans/page.tsx`:

```typescript
const planFeatures: Record<string, string[]> = {
  monthly: [
    "Feature 1",
    "Feature 2",
    // Add more features
  ],
  annual: [
    "Feature 1",
    "Feature 2",
    // Add more features
  ],
};
```

#### Changing Plan Icons

Modify the `getPlanIcon` function:

```typescript
const getPlanIcon = (type: string) => {
  if (type === "annual") return <YourIcon className="h-5 w-5" />;
  // Add more conditions
};
```

## Mock Data

If the API is unavailable, the page falls back to mock data defined in the component. Replace or remove mock data once your API is ready.

## Validation Schema

The `planSubscriptionFormSchema` includes:

- Email validation (RFC 5322 compliant)
- Phone validation (international format, 7-15 digits)
- Password minimum length (8 characters)
- Password confirmation matching
- Required fields for all inputs
- Arabic and English text fields for pharmacy details

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels on form inputs
- Screen reader friendly error messages

## Responsive Design

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

## Future Enhancements

- [ ] Plan comparison feature
- [ ] Promo code support
- [ ] Payment gateway integration
- [ ] Subscription management dashboard
- [ ] Email confirmation after subscription
- [ ] Multi-language support for plan descriptions
