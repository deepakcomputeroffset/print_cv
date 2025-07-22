import { addressType, customerType, orderType, staffType } from "@/types/types";
import {
    customerCategory,
    job,
    order,
    product,
    productAttributeType,
    productCategory,
    staff,
    taskType,
} from "@prisma/client";
import { create } from "zustand";

type ModalType =
    | "staffEdit"
    | "staffDelete"
    | "addStaff"
    | "editCustomer"
    | "viewCustomer"
    | "customerDelete"
    | "createProductCategory"
    | "editProductCategory"
    | "deleteProductCategory"
    | "addNewproduct"
    | "editProduct"
    | "deleteProduct"
    | "addAttribute"
    | "addAttributeValue"
    | "transaction"
    | "addTaskType"
    | "editTaskType"
    | "deleteTaskType"
    | "addJob"
    | "editJob"
    | "deleteJob"
    | "selectJob"
    | "cancelOrder"
    | "improperOrder"
    | "addCustomerCategory"
    | "editCustomerCategory"
    | "deleteCustomerCategory"
    | "viewFiles"
    | "selectDistributor"
    | "uploadOrderFile";

type DataType = {
    staff?: staffType;
    customer?: customerType;
    page?: string;
    searchParameter?: string;
    productCategory?: productCategory;
    product?: product;
    productCategoryId?: number;
    productAttribute?: productAttributeType;
    customerCategory?: customerCategory;
    taskType?: taskType;
    job?: job;
    orders?: orderType[];
    orderId?: number;
    files?: string[];
    cityId?: number;
    order?: order;
};

interface modalStore {
    modal: ModalType | null;
    data: DataType;
    isOpen: boolean;

    onOpen: (type: ModalType, data: DataType) => void;
    onClose: () => void;
}

export const useModal = create<modalStore>((set) => ({
    modal: null,
    data: {},
    isOpen: false,

    onOpen: (modal, data) => set(() => ({ modal, data, isOpen: true })),
    onClose: () => set(() => ({ modal: null, isOpen: false })),
}));
