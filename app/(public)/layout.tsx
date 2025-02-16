import Navbar from "@/components/navbar/navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            {children}
        </div>
    );
}
