import { sseManager } from "./connection-manager";
import { allowedRoleForOrderManagement } from "@/lib/constants";

/**
 * Call this whenever a new order is placed or file is uploaded
 * to notify admins/order managers in real time.
 */
export function notifyNewOrderForReview(data: {
    orderId: number;
    customerName: string;
    productName?: string;
}) {
    sseManager.sendToRoles(allowedRoleForOrderManagement, {
        type: "order-needs-review",
        data: {
            orderId: data.orderId,
            customerName: data.customerName,
            productName: data.productName ?? "Unknown product",
            timestamp: new Date().toISOString(),
        },
    });
}

/**
 * Call this when a task is assigned to a specific staff member.
 */
export function notifyTaskAssigned(data: {
    userId: number;
    taskId: number;
    title: string;
}) {
    sseManager.sendToUser(data.userId, {
        type: "task-assigned",
        data: {
            taskId: data.taskId,
            title: data.title,
            timestamp: new Date().toISOString(),
        },
    });
}

/**
 * Send a custom notification to a specific user.
 */
export function notifyUser(
    userId: number,
    type: string,
    data: Record<string, unknown>,
) {
    sseManager.sendToUser(userId, { type, data });
}
