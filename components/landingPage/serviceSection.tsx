"use client";
import React from "react";
import {
    Image,
    Clock,
    Settings,
    Leaf,
    Headphones,
    DollarSign,
} from "lucide-react"; // Import individual icons
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Service {
    title: string;
    description: string;
    icon: React.JSX.Element;
    bgColor: string;
    textColor: string;
}

const ServicesSection: React.FC = () => {
    const services: Service[] = [
        {
            title: "Quality Prints",
            description: "High-resolution images & durable materials",
            icon: <Image className="w-10 h-10" />,
            bgColor: "bg-[#D65076]",
            textColor: "text-white",
        },
        {
            title: "Fast Turnaround",
            description: "Same-day service & express shipping options",
            icon: <Clock className="w-10 h-10" />,
            bgColor: "bg-[#EDA371]",
            textColor: "text-gray-800",
        },
        {
            title: "Custom Solutions",
            description: "Tailored designs & personalized support",
            icon: <Settings className="w-10 h-10" />,
            bgColor: "bg-[#E8CCD2]",
            textColor: "text-gray-800",
        },
        {
            title: "Eco-Friendly",
            description: "Sustainable materials & green practices",
            icon: <Leaf className="w-10 h-10" />,
            bgColor: "bg-[#E8CCD2]",
            textColor: "text-black",
        },
        {
            title: "Customer Support",
            description: "24/7 assistance & dedicated account managers",
            icon: <Headphones className="w-10 h-10" />,
            bgColor: "bg-[#EDA371]",
            textColor: "text-black",
        },
        {
            title: "Bulk Discounts",
            description: "Competitive pricing for large orders",
            icon: <DollarSign className="w-10 h-10" />,
            bgColor: "bg-[#D65076]",
            textColor: "text-white",
        },
    ];

    return (
        <section
            className={`px-4 py-32 bg-dominant-color ${sourceSerif4.className}`}
        >
            <div className="max-w-customHaf lg:max-w-custom mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            whileInView={{
                                opacity: 1,
                                transition: {
                                    duration: 0.4,
                                    delay: 0.2 * index + 1,
                                    ease: "linear",
                                },
                            }}
                            viewport={{ once: true }}
                            key={index}
                            className={cn(
                                "rounded-lg shadow-lg p-6 transition duration-300 hover:scale-105 hover:shadow-xl w-full sm:w-auto",
                                service?.bgColor,
                                service?.textColor,
                            )}
                        >
                            <div className="flex items-center justify-center mb-4 text-4xl">
                                {service?.icon}
                            </div>
                            <h3 className="text-2xl font-semibold mb-2 text-center tracking-wide">
                                {service?.title}
                            </h3>
                            <p className="text-center text-base font-semibold tracking-wide">
                                {service?.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const ServicesSectionTwo = () => {
    return (
        <section className={cn("py-20", sourceSerif4.className)}>
            <div
                className={cn(
                    "text-charcoal-black text-[16px] leading-[24px] max-w-customHaf lg:max-w-custom mx-auto px-4",
                    sourceSerif4.className,
                )}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 space-y-7 lg:space-y-0 lg:gap-12">
                    <img
                        src="https://images.unsplash.com/photo-1459664018906-085c36f472af?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8MTh8fHByaW50c3xlbnwwfDB8fHwxNzM5ODEwMjE4fDA&amp;ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80&amp;e=1739875378&amp;s=sUtOgPWfaDIznF5w8pqGNk9Pu10t4m4tWj8Lq7doLGg"
                        className="h-60 lg:h-[410px] w-full object-cover rounded-xl"
                    />

                    <div className="justify-start text-charcoal-black text-[16px] m-0 leading-[24px] h-full flex flex-col">
                        <div className="text-charcoal-black text-[16px] m-0 leading-[24px] ">
                            <h3 className="inline-flex mb-[56px] px-[12px] py-[4px] [box-shadow:rgb(0,_0,_0)_3px_4px_0px_0px] !rounded-[8px] text-[rgb(255,_255,_255)] text-[20px] mt-0 mx-0 leading-[30px]  tracking-[-0.2px] bg-dominant-color">
                                Our Services
                            </h3>
                            <h2 className="text-black bg-white text-6xl md:text-[72px] mt-0 mx-0 leading-[64.8px] tracking-[-0.52px]">
                                Print Perfection
                            </h2>
                        </div>
                        <p className="mb-0 mt-7 text-black bg-white text-[20px] m-0 leading-[30px]  tracking-[-0.2px]">
                            Vibrant prints that capture attention and
                            imagination, bringing your ideas to life with
                            stunning clarity and rich colors. Whether it’s
                            business materials, personal projects, or
                            large-scale prints, we ensure every detail stands
                            out beautifully.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export function OurServices() {
    const tabs = [
        {
            title: "Quality Prints",
            description:
                "Our prints are vibrant and made to last. Quality is our middle name!",
            iamgeUrl:
                "https://images.unsplash.com/photo-1591241880174-e55ec62eedf3?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8Mjl8fHByaW50c3xlbnwwfDB8fHwxNzM5ODEwMjE4fDA&ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&e=1739875378&s=Bn0Ct07ELATED9ZW_MIZ-l5VBA5x6HfJHkKRbDdokyA",
        },
        {
            title: "Fast Turnaround",
            description:
                "Need it fast? We’ve got your back with speedy service!",
            iamgeUrl:
                "https://images.unsplash.com/photo-1581345837712-414b9b6fb450?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8MXx8cHJpbnRzfGVufDB8MHx8fDE3Mzk4MTAyMTh8MA&ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&e=1739875378&s=T_hTIGh5U1e-M0gO5mtUoinqa7xwJLfUm3HnoytrHI8",
        },
        {
            title: "Custom Designs",
            description:
                "Our design team is ready to create something unique just for you!",
            iamgeUrl:
                "https://images.unsplash.com/photo-1505744768106-34d8c47a1327?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8MTV8fHByaW50c3xlbnwwfDB8fHwxNzM5ODEwMjE4fDA&ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&e=1739875378&s=WF22hep3DtG6VUMODp8RyI3WeJ4x8WdvrPEjVqDFelo",
        },
        {
            title: "Eco-Friendly",
            description:
                "We care about the planet. Our materials are eco-friendly and sustainable!",
            iamgeUrl:
                "https://images.unsplash.com/photo-1532152865523-267662aa4483?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8MTB8fHByaW50c3xlbnwwfDB8fHwxNzM5ODEwMjE4fDA&ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&e=1739875378&s=xp9vg-gjcdSOd885_n_a5ePUpYlNlS3gkw74CKQPYbk",
        },
    ];
    return (
        <section className={cn("py-5 lg:py-14", sourceSerif4.className)}>
            <div className="max-w-customHaf lg:max-w-custom mx-auto">
                <div className="relative px-4">
                    {/* <motion.h3
                        initial={{
                            opacity: 0,
                        }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                delay: 0.2,
                                ease: "easeInOut",
                            },
                        }}
                        viewport={{ once: true }}
                        className="inline-flex mb-[56px] px-[24px] py-[18px] shadow-[6px_8px_0px_0px_#000] rounded-2xl rotate-[4deg] text-2xl md:text-4xl sm:text-7xl mt-0 mx-0 leading-[64.8px] font-normal tracking-[-0.52px] bg-dominant-color text-white"
                    >
                        Why Choose Us?
                    </motion.h3> */}
                    <h2 className="mb-10 md:mb-7 text-black bg-white text-5xl md:text-8xl mt-0 mx-0 leading-[103.36px] font-normal tracking-[-0.6px]">
                        Our Features
                    </h2>
                    <p className="inline-flex sm:w-1/2 mb-[32px] text-black bg-white text-[28px] mt-0 mx-0 leading-[42px] font-normal tracking-[-0.8px] ">
                        We offer top-notch printing services with a twist of
                        creativity and fun!
                    </p>
                    <Tabs
                        className="grid lg:flex flex-col gap-5 h-full w-full"
                        defaultValue={tabs?.[0].title}
                    >
                        <TabsList className="text-base leading-[24px] font-normal hidden sm:flex flex-wrap space-y-3 md:space-y-0 w-fit self-end h-full  p-2 bg-[#E8CCD2] shadow-[4px_6px_0px_0px_#000] rounded-2xl">
                            {tabs?.map((tab, idx) => (
                                <TabsTrigger
                                    value={tab?.title}
                                    key={idx}
                                    className="data-[state=active]:bg-dominant-color data-[state=active]:text-white text-charcoal-black text-base leading-[24px] font-normal px-4 py-3 rounded-xl text-[20px] tracking-[-0.2px] select-none text-center"
                                >
                                    {tab?.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {tabs?.map((tab, idx) => (
                            <TabsContent
                                key={idx}
                                value={tab?.title}
                                className="bg-[#E8CCD2] text-charcoal-black rounded-3xl"
                            >
                                <div className="flex-auto flex flex-col lg:flex-row py-10 lg:py-[88px] px-5 md:px-10 lg:px-[112px]">
                                    <div className="self-end lg:w-1/2 lg:pr-[88px] m-0 leading-[24px] font-normal">
                                        <h4 className="mb-[20px] text-4xl md:text-[72px] mt-0 mx-0 leading-10 md:leading-[64.8px] font-normal tracking-[-0.52px]">
                                            {tab.title}
                                        </h4>
                                        <p className="mb-0 text-[20px] m-0 leading-[30px] font-normal tracking-[-0.2px]">
                                            {tab.description}
                                        </p>
                                    </div>
                                    <div className="lg:w-1/2 text-[16px] m-0 leading-[24px] font-normal">
                                        <img
                                            src={tab?.iamgeUrl}
                                            className="h-[430px] w-full object-cover shadow-[4px_6px_0px_0px_#000] rounded-2xl"
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </section>
    );
}
export default ServicesSection;
