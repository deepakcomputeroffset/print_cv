"use client";

import { format } from "date-fns";

interface ClientDateProps {
    date: Date | string;
    formatString?: string;
    className?: string;
}

export function ClientDate({
    date,
    formatString = "dd MMM yyyy, h:mm a",
    className,
}: ClientDateProps) {
    return (
        <span className={className}>
            {format(new Date(date), formatString)}
        </span>
    );
}
