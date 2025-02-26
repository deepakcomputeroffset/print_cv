import "next-auth";
import { customer, staff } from "@prisma/client";
declare module "next-auth" {
    interface User {
        userType: "staff" | "customer" | undefined;
        customer?: Omit<
            customer,
            "createdAt" | "gstNumber" | "password" | "referenceId" | "updatedAt"
        > & { wallet?: { id: number; balance: number } };
        staff?: Omit<staff, "createdAt" | "updatedAt" | "password">;
    }

    interface Session {
        user: {
            userType: "staff" | "customer" | undefined;
            customer?: Omit<
                customer,
                | "createdAt"
                | "gstNumber"
                | "password"
                | "referenceId"
                | "updatedAt"
            > & {
                wallet?: { id: number; balance: number };
            };
            staff?: Omit<staff, "createdAt" | "updatedAt" | "password">;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userType?: "staff" | "customer";
        customer?: Omit<
            customer,
            "createdAt" | "gstNumber" | "password" | "referenceId" | "updatedAt"
        > & { wallet?: { id: number; balance: number } };
        staff?: Omit<staff, "createdAt" | "updatedAt" | "password">;
    }
}
