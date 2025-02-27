import { ROLE } from "@prisma/client";

export const perPageData = 2;
export const defaultCustomerPerPage = 1;
export const defaultStaffPerPage = 5;
export const defaultProductCategoryPerPage = 5;
export const defaultProductPerPage = 1;
export const defaultOrderPerPage = 2;

export const maxImageSize = 5242880; // 5mb
export const maxFileSize = 50 * 1024 * 1024; // 50MB
export const allowedFileMimeType = ["application/pdf"];
export const allowedImageMimeType = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
];

export const allowedRoleForOrderManagement: ROLE[] = ["ADMIN", "ORDER_MANAGER"];
export const allowedRoleForCategoryAndProductManagement: ROLE[] = [
    "ADMIN",
    "PRODUCT_MANAGER",
];
