# React Query Setup

## Overview

This project now uses **React Query (TanStack Query)** for efficient server state management. The provider is configured to wrap only the `(root)` routes, excluding the `(user)` authentication routes.

## Structure

```
app/
├── layout.tsx                 # Root layout (SessionProvider, ThemeProvider)
├── (root)/
│   └── layout.tsx            # Wrapped with ReactQueryProvider ✅
└── (user)/
    └── layout.tsx            # NOT wrapped with ReactQueryProvider ❌

providers/
└── ReactQueryProvider.tsx    # Custom React Query provider

hooks/
└── useReactQuery.ts         # Example custom hooks using React Query
```

## Configuration

### ReactQueryProvider Settings

```typescript
defaultOptions: {
  queries: {
    staleTime: 60 * 1000,        // Data stays fresh for 1 minute
    retry: 1,                     // Retry failed requests once
    refetchOnWindowFocus: true,   // Refetch when user focuses window
    refetchOnReconnect: true,     // Refetch when user reconnects
  },
  mutations: {
    retry: 1,                     // Retry failed mutations once
  },
}
```

## Usage Examples

### 1. Create Custom Hooks

```typescript
// hooks/useReactQuery.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useNotifications(token?: string) {
  return useQuery({
    queryKey: ["notifications", token],
    queryFn: () => getNotifications(token),
    enabled: !!token,
    staleTime: 30 * 1000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => 
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
```

### 2. Use in Components

```typescript
"use client";

import { useNotifications, useMarkNotificationAsRead } from "@/hooks/useReactQuery";
import { useSession } from "next-auth/react";

export default function NotificationsPage() {
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  // Fetch data
  const { data, isLoading, error } = useNotifications(token);
  
  // Mutation
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return <div>{/* Render your data */}</div>;
}
```

## Benefits of React Query

### 1. **Automatic Caching**
- Data is cached automatically
- Reduces unnecessary API calls
- Improves performance

### 2. **Background Refetching**
- Automatically refetches stale data
- Keeps UI up to date
- Configurable refetch intervals

### 3. **Loading & Error States**
- Built-in loading states
- Automatic error handling
- Retry logic included

### 4. **Optimistic Updates**
```typescript
const mutation = useMutation({
  mutationFn: updateData,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['data'] });
    
    // Snapshot previous value
    const previousData = queryClient.getQueryData(['data']);
    
    // Optimistically update
    queryClient.setQueryData(['data'], newData);
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['data'], context?.previousData);
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['data'] });
  },
});
```

### 5. **Pagination & Infinite Scroll**
```typescript
export function useInfiniteProducts() {
  return useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
```

## DevTools

React Query DevTools are automatically included in **development mode** only:

- Open by clicking the React Query icon in the bottom corner
- View all queries and their states
- Inspect cached data
- Trigger refetches manually
- Debug query behavior

## Query Keys Best Practices

```typescript
// ✅ Good - Hierarchical and specific
queryKey: ['products', { categoryId, page, filters }]
queryKey: ['user', userId, 'profile']
queryKey: ['notifications', token]

// ❌ Bad - Too generic
queryKey: ['data']
queryKey: ['items']
```

## Mutation Patterns

### Basic Mutation
```typescript
const mutation = useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  },
});
```

### With Loading State
```typescript
<Button 
  onClick={() => mutation.mutate(data)}
  disabled={mutation.isPending}
>
  {mutation.isPending ? 'Loading...' : 'Submit'}
</Button>
```

### With Error Handling
```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onError: (error) => {
    toast.error(error.message);
  },
  onSuccess: () => {
    toast.success('Updated successfully');
  },
});
```

## Advanced Features

### Prefetching
```typescript
const queryClient = useQueryClient();

await queryClient.prefetchQuery({
  queryKey: ['products', productId],
  queryFn: () => fetchProduct(productId),
});
```

### Dependent Queries
```typescript
const { data: user } = useQuery({
  queryKey: ['user'],
  queryFn: getUser,
});

const { data: projects } = useQuery({
  queryKey: ['projects', user?.id],
  queryFn: () => getProjects(user.id),
  enabled: !!user?.id, // Only run when user exists
});
```

### Query Cancellation
```typescript
export function useSearch(searchTerm: string) {
  return useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/search?q=${searchTerm}`, {
        signal, // Pass the AbortSignal
      });
      return response.json();
    },
  });
}
```

## Migration from Manual State

### Before (Manual State)
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetchData()
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

### After (React Query)
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
});
```

## Resources

- [Official Docs](https://tanstack.com/query/latest)
- [Query Keys](https://tanstack.com/query/latest/docs/guides/query-keys)
- [Mutations](https://tanstack.com/query/latest/docs/guides/mutations)
- [Best Practices](https://tanstack.com/query/latest/docs/guides/important-defaults)

## Common Patterns in This Project

See `app/(root)/notifications/page-example-react-query.tsx` for a complete example of using React Query in a component.

See `hooks/useReactQuery.ts` for example custom hooks.
