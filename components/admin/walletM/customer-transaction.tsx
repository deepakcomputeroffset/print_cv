"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Pagination from "@/components/pagination";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { QueryParams } from "@/types/types";
import { useTransaction } from "@/hooks/use-transaction";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MessageRow } from "@/components/message-row";
import { LoadingRow } from "@/components/loading-row";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    CreditCard,
    Mail,
    Phone,
    User,
    Wallet,
} from "lucide-react";
import { transaction } from "@prisma/client";
import { format } from "date-fns";
import { TransactionFilter } from "@/components/admin/walletM/transaction-filter";
import { useCustomerByWallet } from "@/hooks/use-customer";
import { TransactionCreateModal } from "./model/transaction";
import { useModal } from "@/hooks/use-modal";
import { NUMBER_PRECISION } from "@/lib/constants";

export default function CustomerTransactions({
    filters,
    id,
}: {
    filters: QueryParams;
    id: string;
}) {
    const { onOpen } = useModal();
    // Fetch customer details
    const {
        customer,
        isLoading: customerLoading,
        refetch,
    } = useCustomerByWallet(id);

    // Fetch transactions
    const { data, isLoading, totalPages } = useTransaction({
        ...filters,
        sortorder:
            filters?.sortorder !== undefined ? filters?.sortorder : "desc",
        walletId: id,
    });

    return (
        <div className="space-y-6 h-full min-h-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="w-8 h-8" />
                    <h1 className="text-2xl font-semibold">
                        Transaction Details
                    </h1>
                </div>
                <Link href="/admin/wallet">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Wallets
                    </Button>
                </Link>
            </div>

            {/* Customer Details */}
            <Card className="shadow-md rounded-lg border border-gray-200">
                <CardContent className="p-6">
                    {customerLoading ? (
                        <p className="text-gray-500 text-center">
                            Loading customer details...
                        </p>
                    ) : customer ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Customer Info */}
                            <div className="flex flex-col space-y-2">
                                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                    <User className="w-6 h-6 text-blue-600" />
                                    {customer.name}
                                </h2>
                                <p className="flex items-center text-gray-600 text-lg">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    {customer.businessName}
                                </p>
                                <p className="flex items-center text-gray-600">
                                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                    {customer.email}
                                </p>
                                <p className="flex items-center text-gray-600">
                                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                    {customer.phone}
                                </p>
                            </div>

                            {/* Wallet Balance */}
                            <div className="flex flex-col items-center justify-center bg-blue-100 rounded-lg p-4">
                                <p className="text-gray-700 text-lg font-medium">
                                    Wallet Balance
                                </p>
                                <div className="text-3xl font-bold text-blue-700 flex items-center gap-2">
                                    <Wallet className="w-6 h-6" />
                                    {customer.wallet?.balance.toFixed(
                                        NUMBER_PRECISION,
                                    ) || "0.00"}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        onOpen("transaction", {
                                            customer: customer,
                                        })
                                    }
                                >
                                    <CreditCard className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-500 text-center">
                            Customer not found.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Filter */}
            <Card className="p-4">
                <TransactionFilter
                    filters={filters}
                    refetch={refetch}
                    isLoading={customerLoading}
                />
            </Card>

            {/* Transactions Table */}
            <Card>
                <CardContent className="p-6">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Created By</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <LoadingRow
                                        text="Loading transactions..."
                                        colSpan={6}
                                    />
                                ) : data?.transactions?.length === 0 ? (
                                    <MessageRow
                                        colSpan={6}
                                        text="No transactions found"
                                    />
                                ) : (
                                    data?.transactions?.map(
                                        (
                                            transaction: transaction & {
                                                staff: {
                                                    id: number;
                                                    name: string;
                                                };
                                            },
                                        ) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell>
                                                    {transaction.id}
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.type}
                                                </TableCell>
                                                <TableCell>
                                                    $
                                                    {transaction.amount.toFixed(
                                                        NUMBER_PRECISION,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {format(
                                                        transaction?.createdAt,
                                                        "dd/MM/yyyy",
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {transaction?.description?.substring(
                                                        0,
                                                        30,
                                                    )}
                                                    ...
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.staff.id} -{" "}
                                                    {transaction.staff.name}
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

            <TransactionCreateModal />
        </div>
    );
}
