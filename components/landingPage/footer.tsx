import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Mail,
    Phone,
    Instagram,
    Linkedin,
    Twitter,
    Facebook,
    MapPin,
    ArrowRight,
    Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className={cn(
                "bg-gradient-to-b from-blue-50/50 via-background to-purple-50/30 border-t border-t-primary/10 mt-16",
                sourceSerif4.className,
            )}
            id="connect"
        >
            {/* Decorative top border */}
            <div className="w-full h-1 bg-gradient-to-r from-cyan-500 via-primary to-purple-500"></div>

            <div className="container px-4 py-12 mx-auto">
                {/* Top Section with Logo and Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                    <div className="flex flex-col space-y-4">
                        <Link
                            href="/"
                            className="inline-flex items-center space-x-3 group w-fit"
                        >
                            <div className="relative overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-primary/80 to-cyan-600 transition-all h-12 w-12 p-1">
                                <Image
                                    src="/logo.avif"
                                    fill
                                    alt="Printify Logo"
                                    className="object-cover group-hover:scale-110 transition-transform duration-300 p-1"
                                />
                            </div>

                            <span
                                suppressHydrationWarning
                                className="font-bold text-3xl tracking-tight group-hover:text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500 transition-all duration-300"
                            >
                                Printify
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-md text-sm md:text-base">
                            🚀 Print Perfection at Your Fingertips! From
                            business cards to banners, we bring your ideas to
                            life with high-quality prints that leave a lasting
                            impression.
                        </p>
                    </div>

                    <div className="flex flex-col space-y-4 bg-gradient-to-br from-muted/50 to-background p-6 rounded-xl shadow-sm border border-primary/5">
                        <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
                            Stay Updated
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Subscribe to our newsletter for exclusive offers and
                            printing tips.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Input
                                placeholder="Your email address"
                                className="max-w-xs focus-within:ring-1 focus-within:ring-primary/50 transition-all"
                                type="email"
                            />
                            <Button className="group bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 transition-all">
                                Subscribe
                                <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="my-8 opacity-30" />

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 py-8">
                    {/* About */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground relative w-fit after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-cyan-500">
                            About
                        </h3>
                        <nav className="space-y-3">
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/20 transition-colors">
                                    <ArrowRight className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
                                </div>
                                About Us
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/20 transition-colors">
                                    <ArrowRight className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
                                </div>
                                Terms & Conditions
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/20 transition-colors">
                                    <ArrowRight className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
                                </div>
                                Privacy Policy
                            </Link>
                        </nav>
                    </div>

                    {/* Useful Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground relative w-fit after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-cyan-500">
                            Quick Links
                        </h3>
                        <nav className="space-y-3">
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/20 transition-colors">
                                    <ArrowRight className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
                                </div>
                                Home
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/20 transition-colors">
                                    <ArrowRight className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
                                </div>
                                Services
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/20 transition-colors">
                                    <ArrowRight className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
                                </div>
                                Login
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/20 transition-colors">
                                    <ArrowRight className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
                                </div>
                                Join Us
                            </Link>
                        </nav>
                    </div>

                    {/* Contact & Address */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground relative w-fit after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-cyan-500">
                            Contact Us
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-sm group transition-all">
                                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-cyan-600 text-white shadow-sm mt-1 flex-shrink-0">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                                    <p className="font-medium text-foreground">
                                        Printify Headquarters
                                    </p>
                                    <p>123 Print Street</p>
                                    <p>Delhi, 110001</p>
                                    <p>India</p>
                                </div>
                            </div>
                            <a
                                href="tel:+911234567890"
                                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-cyan-600 text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <Phone className="h-4 w-4" />
                                </div>
                                +91 1234567890
                            </a>
                            <a
                                href="mailto:support@printify.com"
                                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-cyan-600 text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <Mail className="h-4 w-4" />
                                </div>
                                support@printify.com
                            </a>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground relative w-fit after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-cyan-500">
                            Connect With Us
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Follow us on social media for updates, tips, and
                            inspiration.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all border-primary/20 group"
                            >
                                <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-primary hover:text-white hover:border-transparent transition-all border-primary/20 group"
                            >
                                <Facebook className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full hover:bg-gradient-to-r hover:from-blue-400 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all border-primary/20 group"
                            >
                                <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full hover:bg-gradient-to-r hover:from-blue-400 hover:to-sky-500 hover:text-white hover:border-transparent transition-all border-primary/20 group"
                            >
                                <Twitter className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="my-8 opacity-30" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground py-4">
                    <div>
                        <span>
                            © {currentYear}{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
                                Printify
                            </span>
                            . All Rights Reserved.
                        </span>
                    </div>
                    <div className="flex gap-6">
                        <Link
                            href="#"
                            className="hover:text-primary transition-colors text-xs"
                        >
                            Terms
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-primary transition-colors text-xs"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-cyan-500 transition-colors text-xs"
                        >
                            Cookies
                        </Link>
                    </div>
                </div>

                {/* Mobile call-to-action */}
                <div className="sm:hidden mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20 text-center">
                    <p className="text-sm font-medium text-foreground mb-2">
                        Ready to start printing?
                    </p>
                    <Button className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600">
                        Get Started
                    </Button>
                </div>
            </div>
        </footer>
    );
}
