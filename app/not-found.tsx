import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <section className="relative w-full h-screen flex items-center justify-center p-4 bg-background overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-70 animate-pulse" />
                <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl opacity-70 animate-pulse animation-delay-4000" />
            </div>

            <div className="relative z-10 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                </div>

                <h1 className="text-7xl sm:text-8xl font-extrabold text-foreground tracking-tighter">
                    404
                </h1>
                <p className="mt-1 text-lg sm:text-xl font-semibold text-foreground">
                    Page Not Found
                </p>
                <p className="mt-3 max-w-md mx-auto text-muted-foreground">
                    Sorry, we couldn’t find the page you’re looking for. It
                    might have been moved or deleted.
                </p>

                <div className="mt-6">
                    <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground shadow-lg hover:shadow-xl group transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden"
                    >
                        <Link href="/">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                            <Home className="mr-2 h-5 w-5 relative z-10" />
                            <span className="relative z-10">Go Back Home</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
