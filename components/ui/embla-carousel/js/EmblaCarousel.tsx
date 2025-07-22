import "../css/embla.css";
import React, { useState, useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import EmblaCarouselFade from "embla-carousel-fade";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PropType = {
    slides: string[];
    options?: EmblaOptionsType;
    productName?: string;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { slides, options, productName } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(
        {
            ...options,
            loop: true,
        },
        [
            Autoplay({
                playOnInit: false,
                delay: 5000,
                stopOnInteraction: true,
            }),
            EmblaCarouselFade(),
        ],
    );
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
        slidesToScroll: 1,
    });

    // Prev/Next navigation
    const scrollPrev = useCallback(() => {
        if (emblaMainApi) emblaMainApi.scrollPrev();
    }, [emblaMainApi]);

    const scrollNext = useCallback(() => {
        if (emblaMainApi) emblaMainApi.scrollNext();
    }, [emblaMainApi]);

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi],
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaMainApi) return;
        onSelect();

        emblaMainApi.on("select", onSelect).on("reInit", onSelect);
    }, [emblaMainApi, onSelect]);

    return (
        <div className="embla relative select-none">
            {/* Main Carousel */}
            <div className="embla__viewport relative" ref={emblaMainRef}>
                <div className="embla__container p-2">
                    {slides.map((slide, index) => (
                        <div className="embla__slide px-2" key={index}>
                            <div className="relative rounded-lg overflow-hidden aspect-video">
                                <Image
                                    src={slide}
                                    alt={
                                        productName
                                            ? `${productName} - View ${index + 1}`
                                            : `Product view ${index + 1}`
                                    }
                                    fill
                                    className="object-cover transition-transform duration-500"
                                />
                                {index === selectedIndex && (
                                    <div className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-black/15 backdrop-blur-sm text-white text-xs py-1 px-2 rounded">
                                        <span className="font-medium">
                                            {index + 1}
                                        </span>
                                        <span className="text-white/70">
                                            / {slides.length}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Premium Navigation Controls - Fixed position on hover */}
                <button
                    onClick={scrollPrev}
                    className="absolute top-1/2 -translate-y-1/2 left-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all duration-300 shadow-md border border-white/10 opacity-0 lg:opacity-70 group-hover:opacity-100"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    onClick={scrollNext}
                    className="absolute top-1/2 -translate-y-1/2 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all duration-300 shadow-md border border-white/10 opacity-0 lg:opacity-70 group-hover:opacity-100"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Enhanced Thumbnails */}
            <div className="embla-thumbs mt-4">
                <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
                    <div className="embla-thumbs__container py-2 space-x-2">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "embla-thumbs__slide relative rounded-lg cursor-pointer transition-all duration-300 overflow-hidden flex-shrink-0",
                                    index === selectedIndex
                                        ? "embla-thumbs__slide--selected ring-2 ring-primary shadow-md transform scale-105"
                                        : "opacity-70 hover:opacity-100 hover:scale-105",
                                )}
                                onClick={() => onThumbClick(index)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        onThumbClick(index);
                                    }
                                }}
                            >
                                <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                                    <Image
                                        src={slide}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover rounded-lg pointer-events-none"
                                    />
                                </div>
                                <div
                                    className={cn(
                                        "absolute inset-0 border-2 transition-colors duration-300 rounded-lg pointer-events-none",
                                        index === selectedIndex
                                            ? "border-primary"
                                            : "border-transparent hover:border-primary/50",
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmblaCarousel;
