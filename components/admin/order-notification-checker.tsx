"use client";

import { useEffect, useRef } from "react";
import { useSSE } from "@/hooks/use-sse";
import { useNotificationStore } from "@/provider/notification.provider";
import { toast } from "sonner";
import { ShoppingCart, ClipboardList } from "lucide-react";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { playNotificationSound } from "@/lib/notification-sound";

function requestNotificationPermission() {
    if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "default"
    ) {
        Notification.requestPermission();
    }
}

function showBrowserNotification(
    title: string,
    body: string,
    tag = "order-review",
    url = "/admin/review?search=&sortorder=desc&orderStatus=ALL&page=1&perpage=100",
) {
    if (
        typeof window === "undefined" ||
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ) {
        return;
    }

    const notification = new Notification(title, {
        body,
        icon: "/logo.avif",
        tag, // Replaces existing notification with same tag
    });

    notification.onclick = () => {
        window.focus();
        window.location.href = url;
        notification.close();
    };
}

export function OrderNotificationChecker() {
    const { on } = useSSE("/api/admin/notifications/stream");
    const incrementReviewCount = useNotificationStore(
        (s) => s.incrementReviewCount,
    );
    const incrementTaskCount = useNotificationStore(
        (s) => s.incrementTaskCount,
    );
    const hasRequestedPermission = useRef(false);
    const router = useRouter();
    const pathname = usePathname();

    // Request browser notification permission on first mount
    useEffect(() => {
        if (!hasRequestedPermission.current) {
            hasRequestedPermission.current = true;
            requestNotificationPermission();
        }
    }, []);

    // Listen for order-needs-review events
    useEffect(() => {
        const cleanup = on(
            "order-needs-review",
            (data: Record<string, unknown>) => {
                const customerName = data.customerName as string;
                const orderId = data.orderId as number;
                const productName = data.productName as string;

                // 1. Play notification sound
                playNotificationSound();

                // 2. Update badge count
                incrementReviewCount();

                // 3. Show toast notification
                toast.info("New Order Needs Review", {
                    description: `Order #${orderId} from ${customerName} — ${productName}`,
                    duration: 6000,
                    icon: React.createElement(ShoppingCart, {
                        className: "size-4",
                    }),
                    action: {
                        label: "Review",
                        onClick: () => {
                            window.location.href =
                                "/admin/review?search=&sortorder=desc&orderStatus=ALL&page=1&perpage=100";
                        },
                    },
                });

                // 4. Show browser notification
                showBrowserNotification(
                    "New Order Needs Review",
                    `Order #${orderId} from ${customerName} — ${productName}`,
                    `order-${orderId}`,
                    "/admin/review?search=&sortorder=desc&orderStatus=ALL&page=1&perpage=100",
                );

                // 5. Auto-refresh if currently on review page
                if (pathname.startsWith("/admin/review")) {
                    router.refresh();
                }
            },
        );

        return cleanup;
    }, [on, incrementReviewCount, router, pathname]);

    // Listen for task-assigned events
    useEffect(() => {
        const cleanup = on("task-assigned", (data: Record<string, unknown>) => {
            const title = data.title as string;
            const taskId = data.taskId as number;

            // 1. Play notification sound
            playNotificationSound();

            // 2. Update task badge count
            incrementTaskCount();

            // 3. Show toast notification
            toast.info("New Task Assigned", {
                description: title,
                duration: 6000,
                icon: React.createElement(ClipboardList, {
                    className: "size-4",
                }),
                action: {
                    label: "View Tasks",
                    onClick: () => {
                        window.location.href =
                            "/admin/tasks?search=&sortorder=asc&perpage=100";
                    },
                },
            });

            // 4. Show browser notification
            showBrowserNotification(
                "New Task Assigned",
                title,
                `task-${taskId}`,
                "/admin/tasks?search=&sortorder=asc&perpage=100",
            );

            // 5. Auto-refresh if currently on tasks page
            if (pathname.startsWith("/admin/tasks")) {
                router.refresh();
            }
        });

        return cleanup;
    }, [on, incrementTaskCount, router, pathname]);

    return null; // Invisible component — only runs logic
}
