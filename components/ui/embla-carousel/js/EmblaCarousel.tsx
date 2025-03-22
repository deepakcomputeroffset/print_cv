import "../css/embla.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import EmblaCarouselFade from "embla-carousel-fade";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
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

    // Zoom functionality
    const [scale, setScale] = useState<number>(1);
    const [isZoomed, setIsZoomed] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imageContainerRef = useRef<HTMLDivElement>(null);

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
            // Reset zoom when changing slides
            setScale(1);
            setIsZoomed(false);
            setPosition({ x: 0, y: 0 });
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

    // Handle zoom in/out
    const handleZoom = () => {
        if (isZoomed) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        } else {
            setScale(2);
        }
        setIsZoomed(!isZoomed);
    };

    // Handle mouse move for zoomed image
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed || !imageContainerRef.current) return;

        const { left, top, width, height } =
            imageContainerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        // Calculate new position
        const newX = (0.5 - x) * 100;
        const newY = (0.5 - y) * 100;

        setPosition({ x: newX, y: newY });
    };

    return (
        <div className="embla-premium relative">
            {/* Main Carousel */}
            <div
                className="embla-premium__viewport relative"
                ref={emblaMainRef}
            >
                <div
                    className="embla-premium__container p-2"
                    ref={imageContainerRef}
                    onMouseMove={handleMouseMove}
                >
                    {slides.map((slide, index) => (
                        <div className="embla-premium__slide px-2" key={index}>
                            <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
                                <motion.div
                                    className="h-full w-full"
                                    animate={{
                                        scale: scale,
                                        x: isZoomed ? `${position.x}%` : 0,
                                        y: isZoomed ? `${position.y}%` : 0,
                                    }}
                                    transition={{
                                        type: "tween",
                                        duration: 0.2,
                                    }}
                                >
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
                                </motion.div>
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
                    className="embla-premium__prev absolute top-1/2 -translate-y-1/2 left-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all duration-300 shadow-md border border-white/10 opacity-0 lg:opacity-70 group-hover:opacity-100"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    onClick={scrollNext}
                    className="embla-premium__next absolute top-1/2 -translate-y-1/2 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all duration-300 shadow-md border border-white/10 opacity-0 lg:opacity-70 group-hover:opacity-100"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Zoom Button */}
                <button
                    onClick={handleZoom}
                    className="absolute bottom-4 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all duration-300 shadow-md border border-white/10 opacity-0 lg:opacity-70 group-hover:opacity-100"
                    aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                >
                    {isZoomed ? (
                        <ZoomOut className="w-5 h-5" />
                    ) : (
                        <ZoomIn className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Enhanced Thumbnails */}
            <div className="embla-thumbs mt-4">
                <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
                    <div className="embla-thumbs__container">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "embla-thumbs__slide rounded-lg cursor-pointer transition-all duration-300 overflow-hidden",
                                    index === selectedIndex
                                        ? "embla-thumbs__slide--selected ring-2 ring-primary shadow-md transform scale-105"
                                        : "opacity-70 hover:opacity-100 hover:scale-105",
                                )}
                                onClick={() => onThumbClick(index)}
                            >
                                <div className="relative h-16 w-16 lg:h-20 lg:w-20">
                                    <Image
                                        src={slide}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                                <div
                                    className={cn(
                                        "absolute inset-0 border-2 transition-colors duration-300 rounded-lg",
                                        index === selectedIndex
                                            ? "border-primary"
                                            : "border-transparent hover:border-primary/50",
                                    )}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmblaCarousel;
