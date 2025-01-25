"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
    Search,
    UserX,
    UserCheck,
    Eye,
    Pencil,
    Loader2,
    Trash,
} from "lucide-react";
import { format } from "date-fns";
import { useCustomers } from "@/hooks/use-customers";
import { useDebounce } from "@/hooks/use-debounce";
import { CUSTOMER_CATEGORY } from "@prisma/client";
import Pagination from "@/components/pagination";
import { CustomerQueryParams, sortType, status } from "@/lib/api/customers";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { customerWithAddress, useModal } from "@/hooks/useModal";
import { CustomerEditModal } from "@/components/modals/customer/customer-edit-modal";
import { CustomerViewModal } from "@/components/modals/customer/customer-view-modal";
import { CustomerDeleteModal } from "@/components/modals/customer/customer-delete-modal";

export default function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<CustomerQueryParams>;
}) {
    const filters = React.use(searchParams);
    const [search, setSearch] = useState(filters?.search || "");
    const [sortOrder, setSortOrder] = useState<sortType>(
        filters?.sortorder == "asc" ? "asc" : "asc",
    );
    const { setParam } = useUrlFilters();
    const debouncedSearch = useDebounce(search, 300);
    const debouncedSortOrder = useDebounce(sortOrder, 300);
    const { onOpen } = useModal();
    const { customers, totalPages, isLoading, error, toggleBanStatus } =
        useCustomers({
            ...filters,
        });

    useEffect(() => {
        setParam("search", debouncedSearch);
        setParam("sortorder", debouncedSortOrder);
    }, [debouncedSearch, debouncedSortOrder]);

    const getCategoryBadgeClass = (category: "LOW" | "MEDIUM" | "HIGH") => {
        switch (category) {
            case "HIGH":
                return "bg-green-100 text-green-800";
            case "MEDIUM":
                return "bg-blue-100 text-blue-800";
            case "LOW":
                return "bg-gray-100 text-gray-800";
        }
    };

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-800 p-4 rounded-md">
                    Error loading customers:
                    {error instanceof Error
                        ? error.message
                        : "An error occurred"}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 h-full min-h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Customers</h1>
            </div>

            <Card>
                <CardContent className="p-6">
                    {/* Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search customers..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <Select
                            value={filters?.category || "all"}
                            onValueChange={(value) =>
                                setParam(
                                    "category",
                                    value as "all" | CUSTOMER_CATEGORY,
                                )
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Customer Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters?.status || "all"}
                            onValueChange={(value) =>
                                setParam("status", value as status)
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="false">Active</SelectItem>
                                <SelectItem value="true">Banned</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters?.sortby || "id"}
                            onValueChange={(value) => setParam("sortby", value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Sort By</SelectLabel>
                                    <SelectItem value="id">Id</SelectItem>
                                    <SelectItem value="is_Banned">
                                        Status
                                    </SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="business_name">
                                        Business Name
                                    </SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="phone">Phone</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={() =>
                                setSortOrder(
                                    sortOrder == "asc" ? "desc" : "asc",
                                )
                            }
                        >
                            {sortOrder === "desc" ? "↑" : "↓"}
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">
                                        Customer Id
                                    </TableHead>
                                    <TableHead>Customer Info</TableHead>
                                    <TableHead>Business</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-8"
                                        >
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                                Loading customers...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : customers.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-8"
                                        >
                                            No customers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    customers?.map(
                                        (customer: customerWithAddress) => (
                                            <TableRow key={customer?.id}>
                                                <TableCell className="text-center">
                                                    {customer?.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {customer?.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {customer?.email}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {customer?.phone}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {customer?.business_name}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(
                                                            customer?.customer_category,
                                                        )}`}
                                                    >
                                                        {
                                                            customer?.customer_category
                                                        }
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {!!customer?.address ? (
                                                        <div>
                                                            <div className="text-sm">
                                                                {
                                                                    customer
                                                                        ?.address
                                                                        ?.city
                                                                        ?.name
                                                                }
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {
                                                                    customer
                                                                        .address
                                                                        ?.city
                                                                        ?.state
                                                                        ?.name
                                                                }
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            No address
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                                customer.is_Banned
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                                                    >
                                                        {customer.is_Banned
                                                            ? "Banned"
                                                            : "Active"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                toggleBanStatus(
                                                                    customer.id,
                                                                )
                                                            }
                                                        >
                                                            {customer.is_Banned ? (
                                                                <UserCheck className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <UserX className="h-4 w-4 text-red-600" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                onOpen(
                                                                    "editCustomer",
                                                                    {
                                                                        customer,
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                onOpen(
                                                                    "viewCustomer",
                                                                    {
                                                                        customer,
                                                                    },
                                                                );
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                onOpen(
                                                                    "customerDelete",
                                                                    {
                                                                        customer,
                                                                    },
                                                                );
                                                            }}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <Pagination isLoading={isLoading} totalPage={totalPages} />
                </CardContent>
            </Card>
            {/* Modal */}
            <CustomerDeleteModal />
            <CustomerViewModal />
            <CustomerEditModal />
        </div>
    );
}
