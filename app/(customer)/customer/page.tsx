import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
import { IndianRupee } from "lucide-react";
import UpiQrCode from "@/components/quCode";

export const dynamic = "force-dynamic";

export default async function CustomerDashboard() {
    const session = await auth();

    if (!session || session.user.userType != "customer") {
        redirect("/");
    }

    const [recentTransactions, wallet] = await prisma.$transaction([
        prisma.transaction.findMany({
            where: {
                walletId: session?.user?.customer?.wallet?.id,
            },
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.wallet.findUnique({
            where: {
                customerId: session?.user?.customer?.id,
            },
        }),
    ]);
    return (
        <div className="flex flex-col gap-4  max-w-customHaf lg:max-w-custom mx-auto py-5">
            <UpiQrCode />
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Current Balance</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center text-2xl font-bold">
                        <IndianRupee className="w-5 h-5" />
                        <span>{wallet?.balance}</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>T.No</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.id}</TableCell>
                                    <TableCell>
                                        {format(
                                            transaction.createdAt,
                                            "dd/MM/yyyy",
                                        )}
                                    </TableCell>
                                    <TableCell className="flex items-center gap-1">
                                        <IndianRupee className="h-3 w-3" />{" "}
                                        {transaction.amount}
                                    </TableCell>
                                    <TableCell>{transaction.type}</TableCell>
                                    <TableCell>
                                        {transaction.description}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
