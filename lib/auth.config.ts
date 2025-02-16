import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authConfig: AuthOptions = {
    pages: {
        signIn: "/login",
        signOut: "/",
        error: "/error",
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
                            throw new Error("customer not found!!");
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
                                businessName: customer?.businessName,
                                phone: customer?.phone,
                                isBanned: customer?.isBanned,
                                id: customer?.id,
                                customerCategory: customer?.customerCategory,
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
            if (url.match(baseUrl)) return url;
            return baseUrl + url;
        },

        async session({ session, token }) {
            if (!token) {
                session.user.customer = undefined;
                session.user.staff = undefined;
                session.user.userType = undefined;
                return session;
            }

            if (token.userType === "customer" && token.customer) {
                session.user = { ...session.user, customer: token.customer };
                session.user.userType = token.userType;
            } else if (token.userType === "staff" && token.staff) {
                session.user = { ...session.user, staff: token.staff };
                session.user.userType = token.userType;
            }

            return session;
        },
    },
};
