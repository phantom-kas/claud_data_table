"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DataTable } from "./InfiniteDataTable"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"

// Create a query client
const queryClient = new QueryClient()

// Example: Payments Table (matching your original shadcn structure)
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export const paymentColumns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown />
                </Button>
            )
        },
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
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(payment.id)}
                            >
                                Copy payment ID
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>View customer</DropdownMenuItem>
                            <DropdownMenuItem>View payment details</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

function PaymentsExample() {
    return (
        <DataTable<Payment>
            queryKey="payments"
            fetchUrl="/api/payments"
            columns={paymentColumns}
            searchColumn="email"
            searchPlaceholder="Filter emails..."
        />
    )
}

// Example 2: Users Table with custom columns
export type User = {
    id: number
    name: string
    username: string
    email: string
    role: string
}

export const userColumns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown />
                </Button>
            )
        },
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => <code className="text-sm">@{row.getValue("username")}</code>,
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => console.log("Edit user:", user)}
                            >
                                Edit user
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => console.log("View profile:", user)}
                            >
                                View profile
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => console.log("Delete user:", user)}
                            >
                                Delete user
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

function UsersExample() {
    return (
        <DataTable<User>
            queryKey="users"
            fetchUrl="/api/users"
            columns={userColumns}
            searchColumn="q"
            searchPlaceholder="Search users..."
            transformResponse={(response) => ({
                data: response.data.users || response.data,
                nextPage: response.data.nextPage,
            })}
        />
    )
}

// Example 3: Simple Products Table
export type Product = {
    id: number
    name: string
    price: number
    category: string
    stock: number
}

export const productColumns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Product Name",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right">Price</div>,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(price)
            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.getValue("stock") as number
            return (
                <span className={stock < 10 ? "text-red-600 font-semibold" : ""}>
                    {stock} units
                </span>
            )
        },
    },
]

function ProductsExample() {
    return (
        <DataTable<Product>
            queryKey="products"
            fetchUrl="/api/products"
            columns={productColumns}
            searchColumn="search"
            searchPlaceholder="Search products..."
        />
    )
}

// Main App Component
export default function App() {
    const [activeExample, setActiveExample] = React.useState<"payments" | "users" | "products">("payments")

    return (
        <QueryClientProvider client={queryClient}>
            <div className="container mx-auto py-10">
                <h1 className="mb-8 text-3xl font-bold">Data Table with Infinite Scroll</h1>

                {/* Example Switcher */}
                <div className="mb-6 flex gap-2">
                    <Button
                        variant={activeExample === "payments" ? "default" : "outline"}
                        onClick={() => setActiveExample("payments")}
                    >
                        Payments
                    </Button>
                    <Button
                        variant={activeExample === "users" ? "default" : "outline"}
                        onClick={() => setActiveExample("users")}
                    >
                        Users
                    </Button>
                    <Button
                        variant={activeExample === "products" ? "default" : "outline"}
                        onClick={() => setActiveExample("products")}
                    >
                        Products
                    </Button>
                </div>

                {/* Active Example */}
                {activeExample === "payments" && <PaymentsExample />}
                {activeExample === "users" && <UsersExample />}
                {activeExample === "products" && <ProductsExample />}
            </div>
        </QueryClientProvider>
    )
}
