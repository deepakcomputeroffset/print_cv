import { create } from "zustand";

type NotificationState = {
    reviewCount: number;
    taskCount: number;
    setReviewCount: (count: number) => void;
    setTaskCount: (count: number) => void;
    incrementReviewCount: () => void;
    incrementTaskCount: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
    reviewCount: 0,
    taskCount: 0,
    setReviewCount: (count) => set({ reviewCount: count }),
    setTaskCount: (count) => set({ taskCount: count }),
    incrementReviewCount: () =>
        set((state) => ({ reviewCount: state.reviewCount + 1 })),
    incrementTaskCount: () =>
        set((state) => ({ taskCount: state.taskCount + 1 })),
}));
