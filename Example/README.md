# Infinite Data Table Component (shadcn/ui Style)

A fully-featured, reusable React data table component with infinite scrolling and debounced search, built following the **exact shadcn/ui data table pattern** you provided. Built with TanStack Table, TanStack Query, and shadcn/ui components.

## Features

- ✅ **Infinite Scrolling** - Automatically loads more data as you scroll
- ✅ **Debounced Search** - Search with customizable debounce delay
- ✅ **Sorting** - Sort by any column
- ✅ **Column Visibility** - Show/hide columns
- ✅ **Row Selection** - Select single or multiple rows (built-in with shadcn pattern)
- ✅ **Row Actions** - Define actions directly in column definitions (shadcn pattern)
- ✅ **Fully Typed** - Complete TypeScript support
- ✅ **Minimal Setup** - Just pass URL and your column definitions
- ✅ **Shadcn Pattern** - Follows the exact structure from shadcn/ui docs

## Installation

```bash
# Install required dependencies
npm install @tanstack/react-table @tanstack/react-query axios lucide-react

# If using shadcn/ui, install the required components
npx shadcn-ui@latest add table button input checkbox dropdown-menu
```

## Basic Usage (Shadcn Pattern)

```tsx
import { DataTable } from "./InfiniteDataTable"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"

const queryClient = new QueryClient()

// 1. Define your data type
type Payment = {
  id: string
  amount: number
  status: string
  email: string
}

// 2. Define your columns (exactly like shadcn/ui)
const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// 3. Use the DataTable component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataTable<Payment>
        queryKey="payments"
        fetchUrl="/api/payments"
        columns={columns}
        searchColumn="email"
        searchPlaceholder="Filter emails..."
      />
    </QueryClientProvider>
  )
}
```

## Key Difference from Regular shadcn

The ONLY differences from the standard shadcn data table:

1. **Add these props to `<DataTable>`:**
   - `queryKey` - For TanStack Query caching
   - `fetchUrl` - Your API endpoint  
   - `searchColumn` (optional) - Which query param to use for search

2. **Data loads automatically** - No need to manage `data` prop or pagination
3. **Infinite scroll** - Just scroll down to load more

Everything else (columns, actions, selection, etc.) works **exactly like shadcn/ui**!

## API Requirements

Your backend API should follow this structure:

### Request Parameters

```
GET /api/your-endpoint?page=1&limit=20&search=query
```

- `page` - Current page number (starts at 1)
- `limit` - Number of items per page
- `search` (or your custom searchKey) - Search query

### Response Format

**Option 1: Simple format (default)**
```json
{
  "data": [...],
  "nextPage": 2  // or null/undefined if no more pages
}
```

**Option 2: Custom format (use transformResponse)**
```json
{
  "users": [...],
  "hasMore": true,
  "currentPage": 1
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `queryKey` | `string` | Unique key for TanStack Query cache |
| `fetchUrl` | `string` | API endpoint URL |
| `columns` | `ColumnDef<TData>[]` | **Standard TanStack Table column definitions** (same as shadcn) |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchColumn` | `string` | `undefined` | Query parameter name for search (e.g., "email", "q") |
| `searchPlaceholder` | `string` | `"Filter..."` | Placeholder text for search input |
| `searchDebounceMs` | `number` | `500` | Debounce delay for search (ms) |
| `pageSize` | `number` | `20` | Number of items per page |
| `transformResponse` | `function` | Auto | Function to transform API response |
| `getNextPageParam` | `function` | Auto | Function to extract next page number |

## Column Definition (Standard shadcn/ui)

Your column definitions work **exactly like shadcn/ui**. No changes needed!

```tsx
const columns: ColumnDef<Payment>[] = [
  // Selection checkbox
  {
    id: "select",
    header: ({ table }) => <Checkbox ... />,
    cell: ({ row }) => <Checkbox ... />,
  },
  
  // Simple column
  {
    accessorKey: "email",
    header: "Email",
  },
  
  // Column with custom cell
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      return <div className="text-right">${amount.toFixed(2)}</div>
    },
  },
  
  // Sortable column
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  
  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => console.log(payment)}>
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

## Custom Response Transform

If your API returns data in a different format:

```tsx
transformResponse={(response) => ({
  data: response.data.items,              // Extract data array
  nextPage: response.data.hasMore         // Determine if more pages exist
    ? response.data.page + 1 
    : undefined,
})}

getNextPageParam={(lastPage) => lastPage.nextPage}
```

## Complete Working Example

Here's a complete example showing the exact shadcn pattern with infinite scrolling:

```tsx
"use client"

import * as React from "react"
import { DataTable } from "./InfiniteDataTable"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

const queryClient = new QueryClient()

// 1. Define your type
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

// 2. Define columns (exact shadcn pattern)
export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// 3. Use the table
export default function PaymentsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-10">
        <DataTable<Payment>
          queryKey="payments"
          fetchUrl="/api/payments"
          columns={columns}
          searchColumn="email"
          searchPlaceholder="Filter emails..."
        />
      </div>
    </QueryClientProvider>
  )
}
```

## Advanced Examples

### With Row Selection

Row selection works automatically when you include the select column:

```tsx
{
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
    />
  ),
}
```

The component automatically shows "X of Y row(s) selected" at the bottom.

### Custom Search Parameter

```tsx
<DataTable
  queryKey="users"
  fetchUrl="/api/users"
  columns={columns}
  searchColumn="q"              // API will receive ?q=search-term
  searchPlaceholder="Search users..."
  searchDebounceMs={300}        // Faster debounce
/>
```

### Custom Response Transform

If your API returns data in a different format:

```tsx
<DataTable
  queryKey="users"
  fetchUrl="/api/users"
  columns={columns}
  transformResponse={(response) => ({
    data: response.data.users,              // Extract data array
    nextPage: response.data.hasMore         // Determine next page
      ? response.data.currentPage + 1 
      : undefined,
  })}
  getNextPageParam={(lastPage) => lastPage.nextPage}
/>
```

## Styling

The component uses shadcn/ui components and follows the same structure as the shadcn data table. Customize it the same way:

1. Modify component styles via Tailwind classes in column definitions
2. Override shadcn/ui component styles in your theme
3. The table structure is identical to shadcn's implementation

## TypeScript Support

The component is fully typed and works exactly like shadcn:

```tsx
// Define your data type
interface User {
  id: number
  name: string
  email: string
}

// TypeScript enforces correct accessorKey values
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",  // ✅ Valid
    header: "Email",
  },
  {
    accessorKey: "invalid", // ❌ TypeScript error
    header: "Invalid",
  },
]

// Use with your type
<DataTable<User>
  queryKey="users"
  fetchUrl="/api/users"
  columns={columns}
/>
```

## Performance Tips

1. **Adjust page size** based on your data
```tsx
pageSize={30}  // Larger pages = fewer requests
```

2. **Optimize search debounce** for your use case
```tsx
searchDebounceMs={300}  // Faster for better UX
searchDebounceMs={1000} // Slower for heavy queries
```

3. **Memoize expensive cell components**
```tsx
cell: ({ row }) => {
  const Component = React.useMemo(
    () => <ExpensiveComponent data={row.original} />,
    [row.original]
  )
  return Component
}
```

## Troubleshooting

### Data not loading
- Check that your API returns data in the expected format
- Use `transformResponse` if your API format differs
- Check browser console for network errors

### Search not working
- Ensure `searchKey` matches your API parameter name
- Verify your API supports the search parameter

### Infinite scroll not triggering
- Check that `getNextPageParam` returns the correct next page
- Ensure your API returns `nextPage` or equivalent
- Verify `transformResponse` correctly extracts pagination data

## License

MIT
