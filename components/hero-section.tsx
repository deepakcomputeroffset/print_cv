"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  return (
    <div className="relative bg-background">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Professional Printing Services
          <br />
          <span className="text-primary">For Your Business</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          From business cards to banners, we provide high-quality printing solutions
          tailored to your needs. Upload your designs or choose from our templates.
        </p>
        <div className="flex gap-4">
          <Button
            size="lg"
            onClick={() => router.push("/categories")}
          >
            Explore Services
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/contact")}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}