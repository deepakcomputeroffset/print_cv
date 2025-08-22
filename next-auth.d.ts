import "next-auth";
import { customer, customerCategory, staff } from "@prisma/client";
import { addressType } from "./types/types";

declare module "next-auth" {
    interface User {
        userType: "staff" | "customer" | undefined;
        customer?: Omit<
            customer,
            "createdAt" | "gstNumber" | "password" | "referenceId" | "updatedAt"
        > & {
            wallet?: { id: number; balance: number };
            customerCategory: customerCategory;
            address?: addressType;
        };
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
                customerCategory: customerCategory;
                address?: addressType;
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
        > & {
            wallet?: { id: number; balance: number };
            customerCategory: customerCategory;
            address?: addressType;
        };
        staff?: Omit<staff, "createdAt" | "updatedAt" | "password">;
    }
}
