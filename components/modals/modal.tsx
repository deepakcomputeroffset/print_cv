import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { FC, ReactNode } from "react";

interface propsType {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    description?: ReactNode | string;
    children: ReactNode;
}

export const Modal: FC<propsType> = ({
    title,
    isOpen,
    onClose,
    description,
    children,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-full overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {children}
                <DialogDescription>
                    {!!description
                        ? description
                        : "Pay attention while doing this."}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

export const ConfirmationModal: FC<propsType> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            {title}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-center text-zinc-500">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="bg-gray-100 dark:bg-zinc-950 px-6 py-4">
                    {children}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
