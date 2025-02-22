import GetStartedSection from "./getStartedSection";
import HeroSection from "./hero";
import Navbar from "./nav";
import SectionTwo from "./section-2";
import SectionThree from "./sectionThree";
import ServicesSection from "./serviceSection";
import WhySection from "./whySection";

export default function TestPage() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <SectionTwo />
            <ServicesSection />
            <SectionThree />
            <WhySection />
            <GetStartedSection />
        </>
    );
}
