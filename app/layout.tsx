import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/provider/query.provider";
import AuthProvider from "@/provider/auth.provider";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "PrintPress Pro - Professional Printing Services",
    description: "Your one-stop shop for all printing needs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
                suppressHydrationWarning
            >
                <AuthProvider>
                    <QueryProvider>
                        <main className="min-h-screen bg-background">
                            {children}
                        </main>
                        <Toaster />
                    </QueryProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
