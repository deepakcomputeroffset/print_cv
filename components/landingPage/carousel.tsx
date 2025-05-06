"use client";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import fade from "embla-carousel-fade";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CarouselSlide = {
    image: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
};

export default function HomeCarousel({ slides }: { slides: CarouselSlide[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!api) {
            return;
        }

        const handleSelect = () => {
            setActiveIndex(api.selectedScrollSnap());
        };

        api.on("select", handleSelect);
        // Initialize index
        handleSelect();

        return () => {
            api.off("select", handleSelect);
        };
    }, [api]);

    return (
        <div className="relative">
            {/* Premium accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary z-20"></div>

            <Carousel
                className="w-full h-[650px] md:h-[600px] relative overflow-hidden shadow-2xl"
                plugins={[
                    Autoplay({
                        delay: 6000,
                        stopOnInteraction: false,
                        stopOnMouseEnter: true,
                    }),
                    fade(),
                ]}
                opts={{
                    loop: true,
                }}
                setApi={setApi}
            >
                <CarouselContent className="h-full">
                    {slides.map((slide, idx) => (
                        <CarouselItem key={idx} className="relative">
                            <div className="relative w-full h-[650px] md:h-[600px] overflow-hidden">
                                {/* Enhanced gradient overlay with multiple layers for depth */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-70" />

                                {/* Subtle pattern overlay for texture */}
                                <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-[0.03] mix-blend-overlay z-10"></div>

                                <Image
                                    src={slide.image}
                                    fill
                                    alt={
                                        slide.title ||
                                        "Printing services showcase"
                                    }
                                    className="object-cover w-full h-full transform scale-105 transition-transform duration-200 ease-in-out"
                                    style={{
                                        transformOrigin:
                                            idx % 2 === 0
                                                ? "center left"
                                                : "center right",
                                        transform: `scale(${activeIndex === idx ? 1.05 : 1})`,
                                    }}
                                    priority={idx === 0}
                                />

                                {/* Text overlay with enhanced styling */}
                                {(slide.title || slide.subtitle) && (
                                    <div className="absolute inset-0 flex flex-col justify-center z-20 px-8 md:px-16 lg:pl-24 max-w-4xl">
                                        {/* Decorative element */}
                                        <div
                                            className={cn(
                                                "w-16 h-1 mb-6 bg-gradient-to-r from-primary to-cyan-400",
                                                isLoaded && activeIndex === idx
                                                    ? "animate-slide-right"
                                                    : "opacity-0",
                                            )}
                                        ></div>

                                        {slide.title && (
                                            <h1
                                                className={cn(
                                                    "text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6 drop-shadow-xl",
                                                    isLoaded &&
                                                        activeIndex === idx
                                                        ? "animate-slide-up opacity-100"
                                                        : "opacity-0 translate-y-8",
                                                )}
                                                style={{
                                                    transition:
                                                        "all 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.1s",
                                                }}
                                            >
                                                {slide.title}
                                            </h1>
                                        )}

                                        {slide.subtitle && (
                                            <p
                                                className={cn(
                                                    "text-lg md:text-xl text-white/90 mb-8 max-w-xl drop-shadow-md font-medium",
                                                    isLoaded &&
                                                        activeIndex === idx
                                                        ? "animate-slide-up opacity-100"
                                                        : "opacity-0 translate-y-8",
                                                )}
                                                style={{
                                                    transition:
                                                        "all 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.3s",
                                                }}
                                            >
                                                {slide.subtitle}
                                            </p>
                                        )}

                                        {slide.ctaText && (
                                            <div
                                                className={cn(
                                                    "mt-2",
                                                    isLoaded &&
                                                        activeIndex === idx
                                                        ? "animate-slide-up opacity-100"
                                                        : "opacity-0 translate-y-8",
                                                )}
                                                style={{
                                                    transition:
                                                        "all 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.5s",
                                                }}
                                            >
                                                <Button
                                                    size="lg"
                                                    className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 transition-all shadow-lg text-base h-12 px-8 rounded-md"
                                                >
                                                    {slide.ctaText}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Elegant indicator dots with animated active state */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30 gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={`w-12 h-1.5 rounded-full transition-all duration-500 ${
                                activeIndex === index
                                    ? "bg-gradient-to-r from-primary to-cyan-400 w-16"
                                    : "bg-white/40 hover:bg-white/60"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <CarouselPrevious className="left-6 h-10 w-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-none rounded-full shadow-lg hover:scale-110 transition-all" />
                <CarouselNext className="right-6 h-10 w-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-none rounded-full shadow-lg hover:scale-110 transition-all" />
            </Carousel>

            {/* Premium bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        </div>
    );
}
