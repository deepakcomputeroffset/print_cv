"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/provider/notification.provider";
import { OrderNotificationChecker } from "@/components/admin/order-notification-checker";
import { Session } from "next-auth";

export function AdminNotificationWrapper({
    children,
    session,
    initialReviewCount,
    initialTaskCount,
}: {
    children: React.ReactNode;
    session: Session | null;
    initialReviewCount: number;
    initialTaskCount: number;
}) {
    const isStaff = session?.user?.userType === "staff";
    const setReviewCount = useNotificationStore((s) => s.setReviewCount);
    const setTaskCount = useNotificationStore((s) => s.setTaskCount);

    // Hydrate zustand store with server-fetched counts
    useEffect(() => {
        setReviewCount(initialReviewCount);
        setTaskCount(initialTaskCount);
    }, [initialReviewCount, initialTaskCount, setReviewCount, setTaskCount]);

    return (
        <>
            {children}
            {isStaff && <OrderNotificationChecker />}
        </>
    );
}
