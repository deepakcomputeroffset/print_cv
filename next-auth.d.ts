import "next-auth";
import { user, UserRole } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: user & {
            // id: string;
            // email: string;
            // phone: string;
            // isBanned: boolean;
            // businessName: string;
            // name: string;
            // role: UserRole;
        };
    }

    interface User extends user {}
}

declare module "next-auth/jwt" {
    interface JWT extends user {}
}
