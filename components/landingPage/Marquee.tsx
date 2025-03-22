import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import Marque from "react-fast-marquee";

export function MarqueeSection() {
    return (
        <Marque className="bg-[#EDA371] ">
            <p
                className={cn(
                    "py-10 md:py-14 font-medium text-3xl md:text-5xl",
                    sourceSerif4.className,
                )}
            >
                Exceptional customer service at your fingertips! * Innovative
                solutions for all your printing needs! *
            </p>
        </Marque>
    );
}
