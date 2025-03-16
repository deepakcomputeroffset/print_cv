import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CustomerEditForm } from "./components/customer-edit-form";
import { customerType } from "@/types/types";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CustomerEditPage() {
    try {
        const session = await auth();

        if (!session || session.user.userType !== "customer") {
            redirect("/login");
        }
        const customer = await prisma?.customer.findUnique({
            where: {
                id: session?.user?.customer?.id,
            },
            omit: {
                password: true,
                isBanned: true,
                referenceId: true,
            },
            include: {
                address: {
                    include: {
                        city: {
                            include: {
                                state: {
                                    include: { country: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!customer) {
            redirect("/customer");
        }

        return (
            <div className="max-w-customHaf lg:max-w-custom mx-auto py-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomerEditForm customer={customer as customerType} />
                    </CardContent>
                </Card>
            </div>
        );
    } catch (error) {
        console.error(error);
        return <div>Error</div>;
    }
}
