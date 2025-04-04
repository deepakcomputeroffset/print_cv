import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
    IndianRupee,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    Info,
} from "lucide-react";
import UpiQrCode from "@/components/quCode";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { sourceSerif4 } from "@/lib/font";
import Pagination from "@/components/pagination";

export default async function CustomerWalletPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; perpage?: string }>;
}) {
    const session = await auth();

    if (!session || session.user.userType != "customer") {
        redirect("/");
    }

    // Parse pagination params
    const { page, perpage } = await searchParams;
    // const page = searchParams.page ? parseInt(searchParams.page) : 1;
    // const perPage = searchParams.perpage ? parseInt(searchParams.perpage) : 10;

    // Get wallet and transaction data
    const [transactions, wallet, transactionsCount] = await Prisma.$transaction(
        [
            // Get paginated transactions
            Prisma.transaction.findMany({
                where: {
                    walletId: session?.user?.customer?.wallet?.id,
                },
                take: Number(perpage) || 10,
                skip: (Number(page) || 1 - 1) * Number(perpage) || 10,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            // Get wallet balance
            Prisma.wallet.findUnique({
                where: {
                    customerId: session?.user?.customer?.id,
                },
            }),
            // Get total count for pagination
            Prisma.transaction.count({
                where: {
                    walletId: session?.user?.customer?.wallet?.id,
                },
            }),
        ],
    );

    // Calculate transaction stats
    const creditTransactions = transactions.filter(
        (transaction) => transaction.type === "CREDIT",
    );
    const debitTransactions = transactions.filter(
        (transaction) => transaction.type === "DEBIT",
    );

    const totalPages = Math.ceil(transactionsCount / Number(perpage) || 10);

    return (
        <div className="max-w-customHaf lg:max-w-custom mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <div className="flex items-center mb-2">
                    <div className="h-1 w-10 bg-gradient-to-r from-primary to-blue-500 rounded-full mr-3"></div>
                    <h1
                        className={cn(
                            "text-3xl font-bold text-gray-800 dark:text-gray-100",
                            sourceSerif4.className,
                        )}
                    >
                        My Wallet
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400 ml-14">
                    Manage your wallet balance and view transaction history
                </p>
            </div>

            {/* Wallet Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Balance Card */}
                <Card className="shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <Wallet className="h-12 w-12 text-primary mb-4" />
                            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                                Current Balance
                            </h2>
                            <div className="text-4xl font-bold text-primary mt-2">
                                ₹{wallet?.balance.toFixed(2) || "0.00"}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Credit Transactions */}
                <Card className="shadow-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-green-100 dark:border-gray-600">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <ArrowDownLeft className="h-12 w-12 text-green-600 mb-4" />
                            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                                Total Deposits
                            </h2>
                            <div className="text-3xl font-bold text-green-600 mt-2">
                                ₹
                                {creditTransactions
                                    .reduce(
                                        (sum, transaction) =>
                                            sum + transaction.amount,
                                        0,
                                    )
                                    .toFixed(2)}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                {creditTransactions.length} transactions
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Debit Transactions */}
                <Card className="shadow-md bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border border-red-100 dark:border-gray-600">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <ArrowUpRight className="h-12 w-12 text-red-600 mb-4" />
                            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                                Total Withdrawals
                            </h2>
                            <div className="text-3xl font-bold text-red-600 mt-2">
                                ₹
                                {debitTransactions
                                    .reduce(
                                        (sum, transaction) =>
                                            sum + transaction.amount,
                                        0,
                                    )
                                    .toFixed(2)}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                {debitTransactions.length} transactions
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Transaction History */}
                <div className="lg:col-span-2">
                    <Card className="shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-semibold flex items-center">
                                    <History className="h-5 w-5 mr-2 text-primary/70" />
                                    Transaction History
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">
                                                Amount
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="h-24 text-center"
                                                >
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <IndianRupee className="h-8 w-8 mb-2 text-gray-300" />
                                                        <p>
                                                            No transactions yet
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            transactions.map((transaction) => (
                                                <TableRow key={transaction.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex flex-col">
                                                            <span>
                                                                {format(
                                                                    new Date(
                                                                        transaction.createdAt,
                                                                    ),
                                                                    "MMM d, yyyy",
                                                                )}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {format(
                                                                    new Date(
                                                                        transaction.createdAt,
                                                                    ),
                                                                    "h:mm a",
                                                                )}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={
                                                                transaction.type ===
                                                                "CREDIT"
                                                                    ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                                                    : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                                                            }
                                                        >
                                                            {transaction.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell
                                                        className="max-w-[200px] truncate"
                                                        title={
                                                            transaction.description
                                                        }
                                                    >
                                                        {
                                                            transaction.description
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div
                                                            className={cn(
                                                                "flex items-center justify-end font-medium",
                                                                transaction.type ===
                                                                    "CREDIT"
                                                                    ? "text-green-600"
                                                                    : "text-red-600",
                                                            )}
                                                        >
                                                            {transaction.type ===
                                                            "CREDIT" ? (
                                                                <ArrowDownLeft className="h-3.5 w-3.5 mr-1" />
                                                            ) : (
                                                                <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                                                            )}
                                                            ₹
                                                            {transaction.amount.toFixed(
                                                                2,
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {transactionsCount > Number(perpage || 10) && (
                                <div className="mt-4">
                                    <Pagination
                                        isLoading={false}
                                        totalPage={totalPages}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Add Money */}
                <div>
                    <Card className="shadow-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl font-semibold flex items-center">
                                <IndianRupee className="h-5 w-5 mr-2 text-primary/70" />
                                Add Money to Wallet
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UpiQrCode />

                            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-start space-x-2">
                                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        <p className="font-medium mb-1">
                                            How to add money:
                                        </p>
                                        <ol className="list-decimal ml-5 space-y-1">
                                            <li>
                                                Enter the amount you want to add
                                            </li>
                                            <li>
                                                Click &quot;Generate QR
                                                Code&quot;
                                            </li>
                                            <li>
                                                Scan the QR code with any UPI
                                                app
                                            </li>
                                            <li>Complete the payment</li>
                                            <li>
                                                Balance will be updated after
                                                verification
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
