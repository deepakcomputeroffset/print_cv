import GetStartedSection from "./getStartedSection";
import HeroSection from "./hero";
import Navbar from "./nav";
import PrintLikeProSection from "./printLikeProSection";
import SectionTwo from "./section-2";
import SectionThree from "./sectionThree";
import ServicesSection, { ServicesSectionTwo } from "./serviceSection";
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
            <PrintLikeProSection />
            <ServicesSectionTwo />
        </>
    );
}
