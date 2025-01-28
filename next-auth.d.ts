import "next-auth";
import { customer, staff } from "@prisma/client";

declare module "next-auth" {
    interface User {
        userType: "staff" | "customer";
        customer: customer;
        staff: staff;
    }

    interface Session {
        user: {
            userType: "staff" | "customer";
            customer: customer;
            staff: staff;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userType?: "staff" | "customer";
        customer?: customer;
        staff?: staff;
    }
}
