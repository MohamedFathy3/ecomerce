# React Hook Form Integration - Plan Subscription

## Overview

Successfully refactored the Plan Subscription Modal to use **React Hook Form** with **Zod validation** for better form management and validation.

## Changes Made

### 1. **Added Form Component** (`/components/ui/form.tsx`)

Created a new shadcn/ui form component that integrates with React Hook Form:

- `Form` - FormProvider wrapper
- `FormField` - Field controller
- `FormItem` - Field container
- `FormLabel` - Label with error styling
- `FormControl` - Input wrapper
- `FormMessage` - Error message display

### 2. **Refactored PlanSubscriptionModal** (`/components/custom/plans/PlanSubscriptionModal.tsx`)

#### Before (Manual State Management):

```typescript
const [formData, setFormData] = useState<Partial<PlanSubscriptionFormData>>({...});
const handleInputChange = (field, value) => {...};
<Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
```

#### After (React Hook Form):

```typescript
const form = useForm<PlanSubscriptionFormData>({
  resolver: zodResolver(planSubscriptionFormSchema),
  defaultValues: {...},
});

<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Full Name *</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Benefits

### ✅ **Better Validation**

- Real-time validation with Zod schema
- Field-level error messages
- Automatic error display below each field

### ✅ **Improved UX**

- Cleaner error handling
- Better form state management
- Automatic focus on first error

### ✅ **Less Boilerplate**

- No manual state management
- No manual change handlers
- Automatic form reset

### ✅ **Type Safety**

- Full TypeScript support
- Inferred types from Zod schema
- Better IDE autocomplete

## Form Fields

### Personal Information:

- **name** - Full name (required)
- **email** - Email address (required, validated)
- **phone** - Phone number (required, regex validated)
- **password** - Password (required, min 8 chars)
- **password_confirmation** - Password confirmation (optional, must match)

### Pharmacy Information:

- **pharmacy_name_ar** - Pharmacy name in Arabic (required)
- **pharmacy_name_en** - Pharmacy name in English (required)
- **pharmacy_address_ar** - Address in Arabic (required)
- **pharmacy_address_en** - Address in English (required)
- **pharmacy_phone** - Pharmacy phone (required, validated)
- **pharmacy_email** - Pharmacy email (required, validated)

## Validation Schema

All validation is handled by `planSubscriptionFormSchema` in `/lib/validators.ts`:

```typescript
export const planSubscriptionFormSchema = z
  .object({
    plan_id: z.number().int().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/),
    password: z.string().min(8),
    password_confirmation: z.string().min(8).optional(),
    pharmacy_name_ar: z.string().min(1),
    pharmacy_name_en: z.string().min(1),
    pharmacy_address_ar: z.string().min(1),
    pharmacy_address_en: z.string().min(1),
    pharmacy_phone: z.string().regex(/^\+?[0-9]{7,15}$/),
    pharmacy_email: z.string().email(),
  })
  .refine(
    (data) =>
      !data.password_confirmation ||
      data.password === data.password_confirmation,
    {
      message: "Passwords must match",
      path: ["password_confirmation"],
    }
  );
```

## Form Submission

```typescript
const onSubmit = async (data: PlanSubscriptionFormData) => {
  try {
    const response = await subscribeToPlan(data);

    if (response.success) {
      toast.success("Subscription successful! Welcome aboard! 🎉");
      form.reset();
      onClose();
    } else {
      // Handle API validation errors
      if (response.errors) {
        Object.entries(response.errors).forEach(([field, messages]) => {
          toast.error(`${field}: ${messages.join(", ")}`);
        });
      }
    }
  } catch (error) {
    toast.error("Failed to subscribe. Please try again.");
  }
};
```

## Error Handling

### Client-Side Validation:

- Zod schema validates before submission
- Errors display below each field
- Form won't submit if validation fails

### Server-Side Validation:

- API errors shown as toast notifications
- Field-specific errors highlighted
- Generic error fallback

## Form Reset

The form automatically resets when:

1. Modal opens (useEffect hook)
2. Submission succeeds
3. Modal closes

```typescript
useEffect(() => {
  if (isOpen) {
    form.reset({ ...defaultValues });
  }
}, [isOpen, plan.id, form]);
```

## Accessibility

- ✅ Proper label associations
- ✅ ARIA attributes automatically added
- ✅ Keyboard navigation support
- ✅ Screen reader friendly error messages
- ✅ Focus management

## Dependencies

Required packages:

```json
{
  "react-hook-form": "^7.x.x",
  "@hookform/resolvers": "^3.x.x",
  "zod": "^3.x.x"
}
```

## TypeScript Notes

The linting warnings about implicit `any` types in the `field` parameters are expected and harmless. React Hook Form provides the correct types at runtime. These can be ignored or suppressed if desired.

## Testing

To test the form:

1. Navigate to `/plans`
2. Click "Subscribe Now" on any plan
3. Try submitting with empty fields (should show validation errors)
4. Fill in invalid email/phone (should show format errors)
5. Use mismatched passwords (should show password mismatch error)
6. Submit valid data (should call API and show success)

## Future Enhancements

- [ ] Add field-level async validation (e.g., check email availability)
- [ ] Add custom error messages per locale
- [ ] Add form analytics/tracking
- [ ] Add autosave to localStorage
- [ ] Add multi-step form wizard
