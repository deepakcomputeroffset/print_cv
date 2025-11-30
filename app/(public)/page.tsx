import HomeCarousel from "@/components/landingPage/carousel";
import { ProductCategoryList } from "@/components/home/cList";
import TestimonialsSection from "@/components/landingPage/testimonialsSection";
import CtaSection from "@/components/landingPage/ctaSection";
import StatsSection from "@/components/landingPage/statsSection";
import FaqSection from "@/components/landingPage/faqSection";
import { carouselSlides } from "@/lib/home.assets";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { Prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export default async function HomePage() {
    async function getCategories() {
        const categories = await Prisma?.productCategory.findMany({
            include: {
                _count: { select: { subCategories: true } },
                parentCategory: true,
            },
            orderBy: {
                isAvailable: "desc",
            },
            take: 8,
        });
        return categories;
    }

    const cachedCategories = await unstable_cache(
        getCategories,
        ["categories"],
        {
            revalidate: 60 * 60 * 24 * 7, // 7 days
            tags: ["categories"],
        },
    )();
    return (
        <div
            className={cn("flex flex-col min-h-screen", sourceSerif4.className)}
        >
            {/* Hero Carousel Section */}
            <HomeCarousel slides={carouselSlides} />

            {/* Main Content */}
            <div className="flex-grow">
                {/* Introduction Section */}
                {/* <HeroSection /> */}

                {/* Product Categories */}
                <Suspense>
                    <section className="pt-5 md:pt-7 bg-gradient-to-b from-background to-blue-50/30">
                        <div className="container px-4 mx-auto">
                            {cachedCategories &&
                                cachedCategories?.length > 0 && (
                                    <ProductCategoryList
                                        categories={cachedCategories}
                                    />
                                )}
                        </div>
                    </section>
                </Suspense>

                {/* Stats Highlights */}
                <StatsSection />

                {/* Customer Testimonials */}
                <TestimonialsSection />

                {/* FAQ Section */}
                <FaqSection />

                {/* Final CTA */}
                <CtaSection />
            </div>
        </div>
    );
}
