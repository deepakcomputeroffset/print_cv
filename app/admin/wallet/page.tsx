"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Pagination from "@/components/pagination";
import { CustomerFilter } from "@/components/admin/customer/customer-filter";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { customerType, QueryParams } from "@/types/types";
import { useWalletM } from "@/hooks/use-walletM";
import { defaultCustomerPerPage } from "@/lib/constants";
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
import { CreditCard, Eye } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { TransactionCreateModal } from "@/components/admin/walletM/model/transaction";
import Link from "next/link";

export default function WalletManagemen({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);
    const { data, isLoading, totalPages } = useWalletM({
        ...filters,
        sortorder:
            filters?.sortorder !== undefined ? filters?.sortorder : "asc",
        perpage: filters?.perpage || defaultCustomerPerPage,
    });
    const { onOpen } = useModal();
    return (
        <div className="space-y-6 h-full min-h-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="w-8 h-8" />
                    <h1 className="text-2xl font-semibold">Wallet</h1>
                </div>
            </div>

            <Card className="p-4">
                {/* Filter */}
                <CustomerFilter filters={filters} />
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">
                                        Customer Id
                                    </TableHead>
                                    <TableHead>Customer Info</TableHead>
                                    <TableHead>Business</TableHead>
                                    <TableHead>Balance</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <LoadingRow
                                        text="Loading customers..."
                                        colSpan={7}
                                    />
                                ) : data.length === 0 ? (
                                    <MessageRow
                                        colSpan={7}
                                        text="No customers found"
                                    />
                                ) : (
                                    data?.map((customer: customerType) => (
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
                                                {customer?.businessName}
                                            </TableCell>
                                            <TableCell>
                                                {customer?.wallet?.balance}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/wallet/${customer?.wallet?.id}?search=&sortorder=desc&perpage=100`}
                                                    >
                                                        <Button
                                                            size={"icon"}
                                                            variant={"ghost"}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            onOpen(
                                                                "transaction",
                                                                {
                                                                    customer,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
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
