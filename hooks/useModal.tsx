import { address, city, country, customer, staff, state } from "@prisma/client";
import { create } from "zustand";

type ModalType =
    | "staffEdit"
    | "staffDelete"
    | "addStaff"
    | "editCustomer"
    | "viewCustomer"
    | "customerDelete";

export type customerWithAddress = customer & {
    address?: address & {
        city?: city & {
            state?: state & {
                country: country;
            };
        };
    };
};

type DataType = {
    staff?: staff;
    customer?: customerWithAddress;
    page?: string;
    searchParameter?: string;
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
