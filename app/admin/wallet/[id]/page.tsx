"use client";

import React, { use } from "react";
import { QueryParams } from "@/types/types";
import { redirect } from "next/navigation";
import CustomerTransactions from "@/components/admin/walletM/customer-transaction";

export default function CustomerTransactionsPage({
    searchParams,
    params,
}: {
    searchParams: Promise<QueryParams>;
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const filters = use(searchParams);

    if (!id || isNaN(parseInt(id))) {
        return redirect("/admin/wallet");
    }

    return <CustomerTransactions filters={filters} id={id} />;
}
