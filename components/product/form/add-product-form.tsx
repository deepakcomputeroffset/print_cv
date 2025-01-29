"use client";

import { useState, useCallback, JSX } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";

export const AddProductForm = () => {
    const { data, isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "addNewproduct" && isOpen === true;
    return (
        <Modal title="Add new product" isOpen={isModalOpen} onClose={onClose}>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {getAllCategories(categories)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Product name" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Product description"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input id="image" placeholder="Image URL" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="productCode">Product Code</Label>
                        <Input id="productCode" placeholder="Product code" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="minQty">Minimum Quantity</Label>
                        <Input
                            type="number"
                            id="minQty"
                            placeholder="Minimum quantity"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="minPrice">Minimum Price</Label>
                        <Input
                            type="number"
                            id="minPrice"
                            placeholder="Min price"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="avgPrice">Average Price</Label>
                        <Input
                            type="number"
                            id="avgPrice"
                            placeholder="Avg price"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="maxPrice">Maximum Price</Label>
                        <Input
                            type="number"
                            id="maxPrice"
                            placeholder="Max price"
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};
