import HomeCarousel from "@/components/landingPage/carousel";
import { Footer } from "@/components/landingPage/footer";
import ServicesSection from "@/components/landingPage/servicesSection";
import { ProductCategoryList } from "@/components/product-category/product-category-list";
import TestimonialsSection from "@/components/landingPage/testimonialsSection";
import CtaSection from "@/components/landingPage/ctaSection";
import StatsSection from "@/components/landingPage/statsSection";
import FaqSection from "@/components/landingPage/faqSection";
import ServiceCategories from "@/components/landingPage/serviceCategories";
import { Prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

async function getCategories() {
    const categories = await Prisma?.productCategory.findMany({
        include: {
            _count: { select: { subCategories: true } },
            parentCategory: true,
        },
        orderBy: {
            isAvailable: "desc",
        },
    });
    return categories;
}

const cachedCategories = unstable_cache(getCategories, ["categories"], {
    revalidate: 60 * 60,
    tags: ["categories"],
});

export default async function HomePage() {
    // const categories = await Prisma?.productCategory.findMany({
    //     include: {
    //         _count: { select: { subCategories: true } },
    //         parentCategory: true,
    //     },
    //     orderBy: {
    //         isAvailable: "desc",
    //     },
    // });

    const categories = await cachedCategories();

    const carouselSlides = [
        {
            image: "https://images.unsplash.com/reserve/uZYSV4nuQeyq64azfVIn_15130980706_64134efc6e_o.jpg?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "Premium Printing Solutions",
            subtitle:
                "Transform your ideas into stunning print materials with our professional services",
            cta: {
                text: "Explore Services",
                link: "/categories",
            },
        },
        {
            image: "https://images.unsplash.com/photo-1456456496250-d5e7c0a9b44d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "Business Printing Made Easy",
            subtitle:
                "From business cards to banners, we've got all your corporate needs covered",
            cta: {
                text: "Get Started",
                link: "/register",
            },
        },
        {
            image: "https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "Fast, Reliable, High-Quality",
            subtitle:
                "Experience print perfection with our state-of-the-art technology and expert team",
            cta: {
                text: "View Samples",
                link: "/products",
            },
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Carousel Section */}
            <HomeCarousel slides={carouselSlides} />

            {/* Main Content */}
            <div className="flex-grow">
                {/* Introduction Section */}
                {/* <HeroSection /> */}

                {/* Visual Service Categories */}
                <ServiceCategories />

                {/* Product Categories */}
                <section className="py-16 bg-gradient-to-b from-background to-blue-50/30">
                    <div className="container px-4 mx-auto">
                        {categories && categories?.length > 0 && (
                            <ProductCategoryList categories={categories} />
                        )}
                    </div>
                </section>

                {/* Stats Highlights */}
                <StatsSection />

                {/* Detailed Services */}
                <ServicesSection />

                {/* Featured Products */}
                {/* <FeaturedProducts /> */}

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
