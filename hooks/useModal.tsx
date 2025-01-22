import { staff } from "@prisma/client";
import { create } from "zustand";

type ModalType = "staffEdit" | "staffDelete" | "addStaff";

type DataType = {
    staff?: staff;
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
