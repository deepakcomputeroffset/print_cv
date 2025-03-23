import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/prisma";
import CustomerEditComponent from "./components/customer-edit-component";
import { customerType } from "@/types/types";

export const dynamic = "force-dynamic";

export default async function CustomerEditPage() {
    try {
        const session = await auth();

        if (!session || session.user.userType !== "customer") {
            redirect("/login");
        }

        const customer: Omit<
            customerType,
            "password" | "isBanned" | "referenceId"
        > | null = await Prisma?.customer.findUnique({
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
                                    include: {
                                        country: true,
                                    },
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

        return <CustomerEditComponent customer={customer} />;
    } catch (error) {
        console.error(error);
        return (
            <div className="max-w-customHaf lg:max-w-custom mx-auto py-8 px-4">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
                    <h2 className="text-red-800 font-medium text-lg mb-2">
                        Error Loading Profile
                    </h2>
                    <p className="text-red-600">
                        Unable to load your profile information. Please try
                        again later.
                    </p>
                </div>
            </div>
        );
    }
}
