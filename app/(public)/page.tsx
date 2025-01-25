import { CategoryList } from "@/components/category-list";
import { HeroSection } from "@/components/hero-section";

export default async function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />
            <section className="container mx-auto py-16">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Our Printing Services
                </h2>
                <CategoryList />
            </section>

            <section className="bg-muted py-16">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Why Choose Us?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-background rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">
                                Professional Quality
                            </h3>
                            <p className="text-muted-foreground">
                                State-of-the-art printing technology for
                                exceptional results.
                            </p>
                        </div>
                        <div className="p-6 bg-background rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">
                                Fast Turnaround
                            </h3>
                            <p className="text-muted-foreground">
                                Quick delivery without compromising on quality.
                            </p>
                        </div>
                        <div className="p-6 bg-background rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">
                                Custom Solutions
                            </h3>
                            <p className="text-muted-foreground">
                                Tailored printing services to meet your specific
                                needs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
