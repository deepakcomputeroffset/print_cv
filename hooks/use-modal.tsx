import { customerType, orderType } from "@/types/types";
import {
    job,
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
    | "selectJob";

type DataType = {
    staff?: staff;
    customer?: customerType;
    page?: string;
    searchParameter?: string;
    productCategory?: productCategory;
    product?: product;
    productCategoryId?: number;
    productAttribute?: productAttributeType;
    taskType?: taskType;
    job?: job;
    orders?: orderType[];
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
