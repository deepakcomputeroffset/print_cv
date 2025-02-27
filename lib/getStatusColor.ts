import { STATUS } from "@prisma/client";

export const getStatusColor = (status: STATUS) => {
    switch (status) {
        case "CANCELLED":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "PENDING":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "PROCESSING":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "DISPATCHED":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
};
