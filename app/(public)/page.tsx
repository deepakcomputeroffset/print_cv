import HomeCarousel from "@/components/landingPage/carousel";
import { Footer } from "@/components/landingPage/footer";
import ServicesSection from "@/components/landingPage/servicesSection";
import { ProductCategoryList } from "@/components/home/cList";
import TestimonialsSection from "@/components/landingPage/testimonialsSection";
import CtaSection from "@/components/landingPage/ctaSection";
import StatsSection from "@/components/landingPage/statsSection";
import FaqSection from "@/components/landingPage/faqSection";
import ServiceCategories from "@/components/landingPage/serviceCategories";
import { carouselSlides, Product_Categories } from "@/lib/home.assets";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";

// async function getCategories() {
//     const categories = await Prisma?.productCategory.findMany({
//         include: {
//             _count: { select: { subCategories: true } },
//             parentCategory: true,
//         },
//         orderBy: {
//             isAvailable: "desc",
//         },
//     });
//     return categories;
// }

// const cachedCategories = unstable_cache(getCategories, ["categories"], {
//     revalidate: 60 * 60,
//     tags: ["categories"],
// });

export default async function HomePage() {
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
                    <section className="pt-16 bg-gradient-to-b from-background to-blue-50/30">
                        <div className="container px-4 mx-auto">
                            {Product_Categories &&
                                Product_Categories?.length > 0 && (
                                    <ProductCategoryList
                                        categories={Product_Categories}
                                    />
                                )}
                        </div>
                    </section>
                </Suspense>

                {/* Stats Highlights */}
                <StatsSection />

                {/* Visual Service Categories */}
                <ServiceCategories />

                {/* Detailed Services */}
                <ServicesSection />

                {/* Customer Testimonials */}
                <TestimonialsSection />

                {/* FAQ Section */}
                <FaqSection />

                {/* Final CTA */}
                <CtaSection />
            </div>

            <Footer />
        </div>
    );
}
