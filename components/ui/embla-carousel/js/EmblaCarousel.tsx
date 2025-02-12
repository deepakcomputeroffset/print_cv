import "../css/embla.css";
import React, { useState, useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import EmblaCarouselFade from "embla-carousel-fade";
import Image from "next/image";

type PropType = {
    slides: string[];
    options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { slides, options } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options, [
        Autoplay({ playOnInit: true, delay: 3000, stopOnInteraction: false }),
        EmblaCarouselFade(),
    ]);
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
    });

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
        <div className="embla theme-light">
            <div className="embla__viewport" ref={emblaMainRef}>
                <div className="embla__container">
                    {slides.map((slide, index) => (
                        <div className="embla__slide" key={index}>
                            <div className="aspect-square relative rounded-lg overflow-hidden">
                                <Image
                                    src={slide}
                                    alt={`View ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla-thumbs">
                <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
                    <div className="embla-thumbs__container">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={"embla-thumbs__slide rounded-lg".concat(
                                    index === selectedIndex
                                        ? " embla-thumbs__slide--selected"
                                        : "",
                                )}
                                onClick={() => onThumbClick(index)}
                            >
                                <div className="relative w-10 h-10 aspect-square">
                                    <Image
                                        src={slide}
                                        alt={`View ${index + 1}`}
                                        fill
                                        className="object-fill rounded-lg"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmblaCarousel;
