import { STATUS } from "@prisma/client";

export const getStatusColor = (status: STATUS) => {
    switch (status) {
        case STATUS.CANCELLED:
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case STATUS.FILE_UPLOADED:
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case STATUS.PROCESSING:
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case STATUS.DISPATCHED:
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case STATUS.PROCESSED:
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case STATUS.IMPROPER_ORDER:
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
};
