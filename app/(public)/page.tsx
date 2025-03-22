import HomeCarousel from "@/components/carousel";
import { Footer } from "@/components/landingPage/footer";
import ServicesSection from "@/components/landingPage/serviceSection";
import { ProductCategoryList } from "@/components/product-category/product-category";

export default async function HomePage() {
    const categories = await prisma?.productCategory.findMany({
        include: {
            _count: { select: { subCategories: true } },
            parentCategory: true,
        },
        orderBy: {
            isAvailable: "desc",
        },
    });
    return (
        <>
            {/* <Navbar /> */}
            <div className="space-y-7 px-[5vw]">
                <HomeCarousel
                    images={[
                        "https://images.unsplash.com/reserve/uZYSV4nuQeyq64azfVIn_15130980706_64134efc6e_o.jpg?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "https://images.unsplash.com/photo-1456456496250-d5e7c0a9b44d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    ]}
                />
                {/* <HeroSection /> */}
                {categories && categories?.length > 0 && (
                    <ProductCategoryList categories={categories} />
                )}
                {/* <ImageSection /> */}
                {/* <WhySection /> */}
                <ServicesSection />
                {/* <MarqueeSection /> */}
                {/* <PrintLikeProSection /> */}
                {/* <ServicesSectionTwo /> */}
                {/* <PrintMagicSection /> */}
                {/* <OurServices /> */}
                {/* <GetStartedSection /> */}
                {/* <FeedBackSection /> */}
                {/* <FrequntQuestionsSection /> */}
                {/* <MarqueeSection /> */}
                {/* <ConnectSection /> */}
            </div>

            <Footer />
        </>
    );
}
