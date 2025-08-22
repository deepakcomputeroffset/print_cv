import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Prisma } from "@/lib/prisma";

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
                        const customer = await Prisma?.customer?.findUnique({
                            where: {
                                phone: credentials?.phone,
                            },
                            include: {
                                wallet: {
                                    select: {
                                        balance: true,
                                        id: true,
                                    },
                                },
                                customerCategory: true,
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

                        if (customer?.isBanned || !customer?.isVerifed) {
                            throw new Error("Your account is not active.");
                        }

                        const address = await Prisma.address.findFirst({
                            where: {
                                ownerId: customer?.id,
                                ownerType: "CUSTOMER",
                            },
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
                        });

                        return {
                            userType,
                            customer: {
                                email: customer?.email,
                                name: customer?.name,
                                businessName: customer?.businessName,
                                customerCategory: customer.customerCategory,
                                phone: customer?.phone,
                                isBanned: customer?.isBanned,
                                id: customer?.id,
                                wallet: customer?.wallet,
                                address,
                            },
                        };
                    } else if (userType === "staff") {
                        const staff = await Prisma?.staff?.findUnique({
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
                        if (staff?.isBanned) {
                            throw new Error("Staff is banned!!");
                        }

                        return {
                            userType,
                            staff: {
                                id: staff?.id,
                                name: staff?.name,
                                phone: staff?.phone,
                                email: staff?.email,
                                role: staff?.role,
                                isBanned: staff?.isBanned,
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

    session: {
        strategy: "jwt",
        maxAge: 3600, // 1 hr
    },
    jwt: { maxAge: 3600 },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userType = user.userType;
                if (user.customer) token.customer = user.customer;
                if (user.staff) token.staff = user.staff;
            }
            return token;
        },

        async session({ session, token }) {
            if (!token) {
                session.user.customer = undefined;
                session.user.staff = undefined;
                session.user.userType = undefined;
                return session;
            }

            if (token.userType === "customer") {
                // const customer = await Prisma?.customer?.findUnique({
                //     where: {
                //         phone: token?.customer?.phone,
                //         isBanned: false,
                //     },
                //     include: {
                //         wallet: {
                //             select: {
                //                 balance: true,
                //                 id: true,
                //             },
                //         },
                //         address: {
                //             include: {
                //                 customer: {
                //                     include: {
                //                         address: true,
                //                     },
                //                 },
                //             },
                //         },
                //     },
                // });
                // if (!customer) {
                //     session.user.customer = undefined;
                //     session.user.staff = undefined;
                //     session.user.userType = undefined;
                //     return session;
                // }

                session.user = {
                    customer: token.customer,
                    userType: "customer",
                    staff: undefined,
                };
            } else if (token.userType === "staff") {
                // const staff = await Prisma.staff.findUnique({
                //     where: { id: token?.staff?.id },
                // });
                // if (!staff || staff?.isBanned) {
                //     session.user.customer = undefined;
                //     session.user.staff = undefined;
                //     session.user.userType = undefined;
                //     return session;
                // }
                session.user = {
                    staff: token?.staff,
                    customer: undefined,
                    userType: "staff",
                };
            }
            return session;
        },

        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
};
