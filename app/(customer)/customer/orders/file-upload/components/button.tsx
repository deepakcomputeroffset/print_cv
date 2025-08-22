"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

type ButtonVariants = ComponentProps<typeof Button>["variant"];

export default function Btn({
    href,
    variant = "default",
    className,
    children = "Go Back",
}: {
    href: string;
    variant?: ButtonVariants;
    className?: string;
    children?: React.ReactNode;
}) {
    const router = useRouter();

    return (
        <Button
            onClick={() => router.push(href)}
            variant={variant}
            className={className}
        >
            {children}
        </Button>
    );
}
