import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authConfig: AuthOptions = {
    pages: {
        signIn: "/login",
        newUser: "/register",
        signOut: "/",
        error: "/error",
    },
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "example@gmail.com",
                },
                password: { label: "Password", type: "text" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.password || !credentials?.email) {
                        throw new Error("Enter valid Credentials");
                    }

                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email,
                        },
                    });

                    if (!user) {
                        throw new Error("User not found!!");
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password,
                    );

                    if (!isPasswordValid) {
                        throw new Error("Invalid Creadentials!!");
                    }

                    // return new Promise((res) => {
                    // return res(
                    return {
                        email: user.email,
                        name: user.name,
                        businessName: user.businessName,
                        phone: user.phone,
                        isBanned: user.isBanned,
                        id: user.id.toString(),
                        user_category: user.user_category,

                        // country: user.country,
                        // state: user.state,
                        // city: user.city,
                        // level: user.level,
                        // role: user.role,
                    };
                    // );
                    // });
                } catch (error) {
                    console.error("Error in credentials", error);
                    throw new Error("Wrong credentials");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // token.role = user.role;
                token.id = Number(user.id);
            }
            return token;
        },
        // redirect: async ({ url, baseUrl }) => {
        //   // Handle redirects based on user role
        //   const user = await getServerSession(authConfig); // Get user from session

        //   if (user && user?.user.role === "admin") {
        //     return `${baseUrl}/admin`;
        //   } else if (user && user?.user.role === "staff") {
        //     return `${baseUrl}/staff`;
        //   } else if (user && user.user.role === "customer") {
        //     return `${baseUrl}/customer`;
        //   }
        //   return baseUrl; // Default redirect
        // },
        async session({ session, token }) {
            if (token) {
                // session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
        // authorized({ auth, request: { nextUrl } }) {
        //   const isLoggedIn = !!auth?.user;
        //   const isAdmin = auth?.user?.role === "ADMIN";
        //   const isAdminPanel = nextUrl.pathname.startsWith("/admin");

        //   if (isAdminPanel && !isAdmin) {
        //     return false;
        //   }

        //   return true;
        // },
    },
};
