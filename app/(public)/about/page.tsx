import ServiceCategories from "@/components/landingPage/serviceCategories";
import ServicesSection from "@/components/landingPage/servicesSection";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";

export default function AboutPage() {
    return (
        <div
            className={cn("flex flex-col min-h-screen", sourceSerif4.className)}
        >
            {/* Visual Service Categories */}
            <ServiceCategories />

            {/* Detailed Services */}
            <ServicesSection />
        </div>
    );
}
