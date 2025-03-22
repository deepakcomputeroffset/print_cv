"use client";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import fade from "embla-carousel-fade";
import Image from "next/image";

export default function HomeCarousel({ images }: { images: string[] }) {
    return (
        <Carousel
            className="w-full lg:max-h-80 relative rounded-lg overflow-hidden"
            plugins={[
                Autoplay({
                    delay: 3000,
                    stopOnInteraction: false,
                    stopOnMouseEnter: true,
                }),
                fade(),
            ]}
        >
            <CarouselContent className="h-full">
                {images.map((image, idx) => (
                    <CarouselItem key={idx}>
                        <div className="relative w-full h-80 rounded-sm overflow-hidden">
                            <Image
                                src={image}
                                fill
                                alt={"Image"}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
