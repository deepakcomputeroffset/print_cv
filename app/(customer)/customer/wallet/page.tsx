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
    LucideIcon,
} from "lucide-react";
import UpiQrCode from "@/components/quCode";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { sourceSerif4 } from "@/lib/font";
import Pagination from "@/components/pagination";

const GradientBar = () => (
    <div className="h-1 w-8 bg-gradient-to-r from-primary to-blue-500 rounded-full mr-3" />
);

const StatCard = ({
    icon: Icon,
    title,
    amount,
    count,
    gradient,
    border,
    iconColor,
}: {
    icon: LucideIcon;
    title: string;
    amount: string;
    count?: string;
    gradient: string;
    border: string;
    iconColor: string;
}) => (
    <Card className={cn("shadow-md", gradient, border)}>
        <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
                <Icon className={cn("h-10 w-10 mb-3", iconColor)} />
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {title}
                </h2>
                <div
                    className={cn(
                        "text-2xl font-bold mt-1",
                        iconColor.includes("primary")
                            ? "text-primary"
                            : iconColor,
                    )}
                >
                    {amount}
                </div>
                {count && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {count}
                    </p>
                )}
            </div>
        </CardContent>
    </Card>
);

export default async function CustomerWalletPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; perpage?: string }>;
}) {
    const session = await auth();

    if (!session || session.user.userType != "customer") {
        redirect("/");
    }

    const { page: pp, perpage } = await searchParams;
    const page = parseInt(pp || "1");
    const perPage = parseInt(perpage || "10");

    const [transactions, wallet, transactionsCount] = await Prisma.$transaction(
        [
            Prisma.transaction.findMany({
                where: { walletId: session?.user?.customer?.wallet?.id },
                take: perPage,
                skip: (page - 1) * perPage,
                orderBy: { createdAt: "desc" },
            }),
            Prisma.wallet.findUnique({
                where: { customerId: session?.user?.customer?.id },
            }),
            Prisma.transaction.count({
                where: { walletId: session?.user?.customer?.wallet?.id },
            }),
        ],
    );

    const creditTransactions = transactions.filter((t) => t.type === "CREDIT");
    const debitTransactions = transactions.filter((t) => t.type === "DEBIT");
    const totalPages = Math.ceil(transactionsCount / perPage);

    const creditTotal = creditTransactions.reduce(
        (sum, t) => sum + t.amount,
        0,
    );
    const debitTotal = debitTransactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="container mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center mb-1">
                    <GradientBar />
                    <h1
                        className={cn(
                            "text-2xl font-bold text-gray-800 dark:text-gray-100",
                            sourceSerif4.className,
                        )}
                    >
                        My Wallet
                    </h1>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
                    Manage your wallet balance and view transaction history
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <StatCard
                    icon={Wallet}
                    title="Current Balance"
                    amount={`₹${wallet?.balance.toFixed(2) || "0.00"}`}
                    gradient="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700"
                    border="border border-blue-100 dark:border-gray-600"
                    iconColor="text-primary"
                />
                <StatCard
                    icon={ArrowDownLeft}
                    title="Total Deposits"
                    amount={`₹${creditTotal.toFixed(2)}`}
                    count={`${creditTransactions.length} transactions`}
                    gradient="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700"
                    border="border border-green-100 dark:border-gray-600"
                    iconColor="text-green-600"
                />
                <StatCard
                    icon={ArrowUpRight}
                    title="Total Withdrawals"
                    amount={`₹${debitTotal.toFixed(2)}`}
                    count={`${debitTransactions.length} transactions`}
                    gradient="bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-700"
                    border="border border-red-100 dark:border-gray-600"
                    iconColor="text-red-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Transaction History */}
                <div className="lg:col-span-2">
                    <Card className="shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold flex items-center">
                                <History className="h-4 w-4 mr-2 text-primary/70" />
                                Transaction History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="text-sm">
                                            <TableHead className="py-2">
                                                Date
                                            </TableHead>
                                            <TableHead className="py-2">
                                                Type
                                            </TableHead>
                                            <TableHead className="py-2">
                                                Description
                                            </TableHead>
                                            <TableHead className="text-right py-2">
                                                Amount
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="h-20 text-center"
                                                >
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <IndianRupee className="h-6 w-6 mb-1 text-gray-300" />
                                                        <p className="text-sm">
                                                            No transactions yet
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            transactions.map((transaction) => (
                                                <TableRow
                                                    key={transaction.id}
                                                    className="text-sm"
                                                >
                                                    <TableCell className="py-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium">
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
                                                    <TableCell className="py-2">
                                                        <Badge
                                                            className={cn(
                                                                "text-xs px-2 py-0.5",
                                                                transaction.type ===
                                                                    "CREDIT"
                                                                    ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                                                    : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800",
                                                            )}
                                                        >
                                                            {transaction.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell
                                                        className="max-w-[150px] truncate py-2 text-xs"
                                                        title={
                                                            transaction.description
                                                        }
                                                    >
                                                        {
                                                            transaction.description
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-right py-2">
                                                        <div
                                                            className={cn(
                                                                "flex items-center justify-end font-medium text-xs",
                                                                transaction.type ===
                                                                    "CREDIT"
                                                                    ? "text-green-600"
                                                                    : "text-red-600",
                                                            )}
                                                        >
                                                            {transaction.type ===
                                                            "CREDIT" ? (
                                                                <ArrowDownLeft className="h-3 w-3 mr-1" />
                                                            ) : (
                                                                <ArrowUpRight className="h-3 w-3 mr-1" />
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
                            {transactionsCount > perPage && (
                                <div className="mt-3">
                                    <Pagination
                                        isLoading={false}
                                        totalPage={totalPages}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Add Money Section */}
                <div>
                    <Card className="shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold flex items-center">
                                <IndianRupee className="h-4 w-4 mr-2 text-primary/70" />
                                Add Money
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <UpiQrCode />
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-start space-x-2">
                                    <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-xs text-gray-600 dark:text-gray-300">
                                        <p className="font-medium mb-1">
                                            How to add money:
                                        </p>
                                        <ol className="list-decimal ml-4 space-y-0.5">
                                            <li>Enter amount to add</li>
                                            <li>
                                                Click &quot;Generate QR
                                                Code&quot;
                                            </li>
                                            <li>Scan QR with UPI app</li>
                                            <li>Complete payment</li>
                                            <li>
                                                Balance updates after
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
