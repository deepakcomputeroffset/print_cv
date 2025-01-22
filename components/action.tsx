"use client";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FC } from "react";

interface propsType {
    deleteBtnClick: () => void;
    editBtnClick: () => void;
}
export const Action: FC<propsType> = ({ editBtnClick, deleteBtnClick }) => {
    return (
        <>
            <Button variant="ghost" size="icon" onClick={editBtnClick}>
                <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={deleteBtnClick}>
                <Trash className="h-4 w-4" />
            </Button>
        </>
    );
};
