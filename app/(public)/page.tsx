import { ConnectSection } from "@/components/landingPage/connect";
import { Footer } from "@/components/landingPage/footer";
// import { FrequntQuestionsSection } from "@/components/landingPage/frequentQuestions";
// import GetStartedSection from "@/components/landingPage/getStartedSection";
import HeroSection from "@/components/landingPage/hero";
// import { MarqueeSection } from "@/components/landingPage/Marquee";
// import Navbar from "@/components/navbar/nav";
// import PrintLikeProSection from "@/components/landingPage/printLikeProSection";
import PrintMagicSection from "@/components/landingPage/printMagicSection";
// import ImageSection from "@/components/landingPage/imageSection";
// import SectionTwo from "./section-2";
// import FeedBackSection from "@/components/landingPage/feedBackSection";
import {
    // OurServices,
    ServicesSectionTwo,
} from "@/components/landingPage/serviceSection";
import WhySection from "@/components/landingPage/whySection";

export default function TestPage() {
    return (
        <>
            {/* <Navbar /> */}
            <HeroSection />
            {/* <MarqueeSection /> */}
            {/* <ImageSection /> */}
            <WhySection />
            {/* <ServicesSection /> */}
            {/* <PrintLikeProSection /> */}
            <ServicesSectionTwo />
            <PrintMagicSection />
            {/* <OurServices /> */}
            {/* <GetStartedSection /> */}
            {/* <FeedBackSection /> */}
            {/* <FrequntQuestionsSection /> */}
            {/* <MarqueeSection /> */}
            <ConnectSection />
            <Footer />
        </>
    );
}
