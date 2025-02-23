import { ConnectSection } from "@/components/landingPage/connect";
import { Footer } from "@/components/landingPage/footer";
import { FrequntQuestionsSection } from "@/components/landingPage/frequentQuestions";
import GetStartedSection from "@/components/landingPage/getStartedSection";
import HeroSection from "@/components/landingPage/hero";
import { MarqueeSection } from "@/components/landingPage/Marquee";
import Navbar from "@/components/landingPage/nav";
import PrintLikeProSection from "@/components/landingPage/printLikeProSection";
import PrintMagicSection from "@/components/landingPage/printMagicSection";
import SectionTwo from "@/components/landingPage/section-2";
// import SectionTwo from "./section-2";
import SectionThree from "@/components/landingPage/sectionThree";
import {
    OurServices,
    ServicesSectionTwo,
} from "@/components/landingPage/serviceSection";
import WhySection from "@/components/landingPage/whySection";

export default function TestPage() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <SectionTwo />
            <SectionThree />
            {/* <ServicesSection /> */}
            <WhySection />
            <GetStartedSection />
            <PrintLikeProSection />
            <ServicesSectionTwo />
            <PrintMagicSection />
            <FrequntQuestionsSection />
            <OurServices />
            <MarqueeSection />
            <ConnectSection />
            <Footer />
        </>
    );
}
