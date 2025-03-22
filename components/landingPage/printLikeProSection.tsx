"use client";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";

export default function PrintLikeProSection() {
    return (
        <section className={cn("py-20 bg-gray-700", sourceSerif4.className)}>
            <div
                className={cn(
                    "max-w-customHaf lg:max-w-custom mx-auto px-4",
                    sourceSerif4.className,
                )}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 space-y-7 lg:space-y-0 lg:gap-12">
                    <div className="justify-center text-white text-[16px] m-0 leading-[24px] h-full flex flex-col">
                        {/* <h3 className="inline-flex mb-[56px] px-[12px] py-[4px] [box-shadow:rgb(0,_0,_0)_3px_4px_0px_0px] !rounded-[8px] text-[rgb(255,_255,_255)] text-[20px] mt-0 mx-0 leading-[30px]  tracking-[-0.2px] bg-dominant-color">
                                Our Services
                            </h3> */}
                        <h2 className="text-6xl md:text-[72px] mt-0 mx-0 leading-[64.8px] tracking-[-0.52px] text-white">
                            Print Like a Pro
                        </h2>
                        <p className="mb-0 mt-7 text-[20px] m-0 leading-[30px]  tracking-[-0.2px]">
                            Transform your ideas into stunning prints with
                            vibrant colors and sharp details. Whether it’s
                            business cards, banners, or custom prints, we craft
                            each piece to perfection. From design to delivery,
                            we make it easy to bring your vision to life.
                        </p>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1526614180703-827d23e7c8f2?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="h-60 lg:h-[410px] w-full object-cover rounded-xl"
                    />
                </div>
            </div>
        </section>
    );
}
