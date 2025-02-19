"use client";

import { Source_Serif_4 } from "next/font/google";
import Link from "next/link";

const sourceSerif4 = Source_Serif_4({
    weight: ["400", "600", "700"],
    subsets: ["latin"],
});

const HeroSection = () => {
    return (
        <section
            className={`w-full box-border relative break-words bg-[50%_50%] bg-no-repeat bg-cover pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-[80px] lg:pb-[80px] text-[rgb(35,35,35)] text-[16px] m-0 leading-[24px] font-normal bg-dominant-color flex items-center justify-center ${sourceSerif4.className}`}
        >
            <div className="box-border w-full px-4 md:px-6 lg:px-[16px] max-w-[1320px] relative break-words flex items-center justify-center">
                <div className="box-border flex flex-col lg:flex-row items-center justify-center -mx-4 md:-mx-6 lg:-mx-[16px]">
                    {/* Left */}
                    <div className="box-border w-full md:w-7/12 max-w-full px-3 md:px-6 lg:px-[16px] relative flex flex-col break-words bg-transparent bg-clip-border rounded-[4px] justify-center">
                        <div className="box-border flex sm:block flex-col items-center justify-center">
                            <h2 className="mt-0 mb-8 md:mb-16 font-normal text-[64px] md:text-5xl lg:text-[121.6px] leading-[1.2] md:leading-[1.1] lg:leading-[103.36px] animate-fadeIn break-words text-white tracking-[-0.6px]">
                                Print Magic
                            </h2>

                            <p className="text-white  bg-[#720026] mt-0 mb-4 md:mb-8 animate-fadeIn leading-7 md:leading-[42px] break-words font-normal w-full md:w-3/5 text-xl lg:text-[28px] tracking-[-0.8px]">
                                Transforming ideas into vibrant prints with
                                flair!
                            </p>

                            <div className="text-center">
                                <Link
                                    href={"#"}
                                    className="text-white text-xl font-semibold leading-6 md:leading-[30px] inline-flex text-center align-middle cursor-pointer bg-dominant-color-2 border border-solid border-dominant-color-2 px-6 py-3 md:px-8 md:py-4 rounded-xl transition duration-500 ease-in-out animate-fadeIn m-2 hover:scale-105"
                                >
                                    See More
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="box-border w-full md:w-5/12 max-w-full px-4 md:px-6 lg:px-4 relative flex min-w-0 bg-transparent justify-center mt-8 md:mt-0">
                        {" "}
                        {/* Added margin-top for mobile */}
                        <div className="box-border ml-0 md:ml-8 lg:ml-[32px]">
                            {" "}
                            {/* Adjusted margin-left */}
                            <img
                                src="https://images.unsplash.com/photo-1532152934380-321e9a99fe20?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8NXx8cHJpbnRzfGVufDB8MHx8fDE3Mzk4MTAyMTh8MA&amp;ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80&amp;e=1739875378&amp;s=AnQpDON_VF0lTuA-LQ7MeKm2u_q9kv14JaFfZEwMf6w"
                                className="box-border align-middle animate-fadeIn block w-full h-auto md:h-[400px] lg:h-[660px] object-cover shadow-[6px_8px_0px_0px_rgb(0,0,0)] rounded-[24px]" // h-auto and adjusted height
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
