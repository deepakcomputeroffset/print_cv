import HeroSection from "./hero";
import Navbar from "./nav";
import SectionTwo from "./section-2";
import SectionThree from "./sectionThree";
import ServicesSection from "./serviceSection";

export default function TestPage() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <SectionTwo />
            <ServicesSection />
            <SectionThree />
        </>
    );
}
