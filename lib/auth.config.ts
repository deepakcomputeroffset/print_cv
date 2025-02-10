import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authConfig: AuthOptions = {
    pages: {
        signIn: "/login",
        signOut: "/",
    },
    providers: [
        Credentials({
            credentials: {
                phone: { label: "Phone", type: "text" },
                password: { label: "Password", type: "text" },
            },

            // eslint-disable-next-line
            async authorize(credentials, req): Promise<any> {
                try {
                    const userType: "staff" | "customer" = req?.body?.userType;
                    if (
                        !credentials?.phone ||
                        !credentials?.password ||
                        !userType
                    ) {
                        throw new Error("Enter all Credentials");
                    }

                    if (userType === "customer") {
                        const customer = await prisma?.customer?.findUnique({
                            where: {
                                phone: credentials?.phone,
                            },
                        });

                        if (!customer) {
                            throw new Error("User not found!!");
                        }

                        const isPasswordValid = await bcrypt.compare(
                            credentials?.password,
                            customer?.password,
                        );

                        if (!isPasswordValid) {
                            throw new Error("Invalid Creadentials!!");
                        }

                        return {
                            userType,
                            customer: {
                                email: customer?.email,
                                name: customer?.name,
                                business_name: customer?.business_name,
                                phone: customer?.phone,
                                isBanned: customer?.is_Banned,
                                id: customer?.id,
                                customer_category: customer?.customer_category,
                            },
                        };
                    } else if (userType === "staff") {
                        const staff = await prisma?.staff?.findUnique({
                            where: {
                                phone: credentials?.phone,
                            },
                        });

                        if (!staff) {
                            throw new Error("staff not found!!");
                        }

                        const isPasswordValid = await bcrypt.compare(
                            credentials?.password,
                            staff?.password,
                        );

                        if (!isPasswordValid) {
                            throw new Error("Invalid Creadentials!!");
                        }

                        return {
                            userType,
                            staff: {
                                id: staff?.id,
                                name: staff?.name,
                                phone: staff?.phone,
                                email: staff?.email,
                                role: staff?.role,
                            },
                        };
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error("Error in credentials", error);
                    throw new Error(error as string);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userType = user.userType;
                if (user.customer) {
                    token.customer = user.customer;
                }
                if (user.staff) {
                    token.staff = user.staff;
                }
            }

            return token;
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) return url;
            return baseUrl;
        },

        async session({ session, token }) {
            if (token.userType === "customer" && token.customer) {
                session.user = { ...session.user, customer: token.customer };
            } else if (token.userType === "staff" && token.staff) {
                session.user = { ...session.user, staff: token.staff };
            }
            return session;
        },

        // authorized({ auth, request: { nextUrl } }) {
        //     const isLoggedIn = !!auth?.user;
        //     const isAdmin = auth?.user?.role === "ADMIN";
        //     const isAdminPanel = nextUrl.pathname.startsWith("/admin");

        //     if (isAdminPanel && !isAdmin) {
        //         return false;
        //     }

        //     return true;
        // },
    },
};
