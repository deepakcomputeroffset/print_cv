import { ROLE, STATUS } from "@prisma/client";

export const perPageData = 2;
export const defaultCustomerPerPage = 1;
export const defaultTransactionPerPage = 1;
export const defaultStaffPerPage = 5;
export const defaultProductCategoryPerPage = 5;
export const defaultDesignCategoryPerPage = 5;
export const defaultDesignPerPage = 5;
export const defaultProductPerPage = 1;
export const defaultOrderPerPage = 2;
export const defaultCarouselPerPage = 10;
export const defaultDepartmentsPerPage = 1;
export const defaultJobsPerPage = 1;

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
export const allowedRoleForCarouselManagement: ROLE[] = ["ADMIN"];
export const allowedRoleForCategoryAndProductManagement: ROLE[] = [
    "ADMIN",
    "PRODUCT_MANAGER",
];
export const allowedRoleForAccountManagement: ROLE[] = ["ADMIN", "ACCOUNTANT"];
export const allowedRoleForJobManagement: ROLE[] = ["ADMIN", "JOB_MANAGER"];
export const allowedRoleForDispatchManagement: ROLE[] = ["ADMIN", "DISPATCHER"];
export const allowedRoleForDistributionManagement: ROLE[] = [
    "ADMIN",
    "DISTRIBUTER",
];

// STATUS
export const orderCancellableStatus: STATUS[] = ["PLACED", "FILE_UPLOADED"];

// TAX
export const IGST_TAX_IN_PERCENTAGE = 0.18;
export const FILE_UPLOAD_EMAIL_CHARGE = 20;

export const NUMBER_PRECISION = 3;

export const COMPANY_DATA = {
    name: "Aditya Printify India Private Limited",
    shortName: "Aditya Printify India",
    addressLine1: "F-55 T/F (Old-FC-6), Gali No 8 West Jyoti Nagar",
    addressLine2: "sabhapur, Delhi North East, Delhi, India",
    url: "www.printvc.com",
    pinCode: "110094",
    phone: "+91-9311831919",
    email: "adityaprintify@gmail.com",
    gst: "07ABDCA7756Q1ZX",
};
