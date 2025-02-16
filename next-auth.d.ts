import "next-auth";
import { customer, staff } from "@prisma/client";

declare module "next-auth" {
    interface User {
        userType: "staff" | "customer" | undefined;
        customer:
            | (customer & { wallet: { id: number; balance: number } })
            | undefined;
        staff: staff | undefined;
    }

    interface Session {
        user: {
            userType: "staff" | "customer" | undefined;
            customer:
                | (customer & { wallet: { id: number; balance: number } })
                | undefined;
            staff: staff | undefined;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userType?: "staff" | "customer" | undefined;
        customer?:
            | (customer & { wallet: { id: number; balance: number } })
            | undefined;
        staff?: staff | undefined;
    }
}
