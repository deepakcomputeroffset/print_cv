"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Action } from "@/components/action";
import { useModal } from "@/hooks/use-modal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import queryString from "query-string";
import { staff } from "@prisma/client";
import { StaffEditModal } from "@/components/staff/modal/staff-edit-modal";
import { Button } from "@/components/ui/button";
import { StaffAddModal } from "@/components/staff/modal/staff-add-modal";
import { StaffDeleteModal } from "@/components/staff/modal/staff-delete-modal";
import React from "react";
import { SearchBar } from "@/components/search";
import Pagination from "@/components/pagination";

export default function StaffPage({
    searchParams,
}: {
    searchParams: Promise<{ page: string; id: string }>;
}) {
    const { page, id } = React.use(searchParams);
    const { data: datas, isLoading } = useQuery({
        queryKey: ["admin-staff", page || "1", id || ""],
        queryFn: async () => {
            try {
                const url = queryString.stringifyUrl({
                    url: "/api/staff",
                    query: {
                        page: page,
                        id,
                    },
                });
                const { data } = await axios(url);
                return data;
            } catch (error) {
                if (error) {
                    console.log(error);
                    toast("Unable to load data");
                    return [];
                }
            }
        },
    });

    const { onOpen } = useModal();

    return (
        <div className="space-y-6">
            <StaffEditModal />
            <StaffAddModal />
            <StaffDeleteModal />
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Staffs</h1>
                <div className="flex items-center gap-2">
                    <SearchBar queryName="id" />
                    <Button onClick={() => onOpen("addStaff", {})}>
                        Add Staff
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="w-full h-[50vh] flex justify-center items-center">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <div className="rounded-md border pb-1">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Id</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!!datas?.data &&
                                datas?.data?.map((data: staff) => (
                                    <TableRow key={data?.id}>
                                        <TableCell>{data?.id}</TableCell>
                                        <TableCell>{data?.name}</TableCell>
                                        <TableCell>{data?.email}</TableCell>
                                        <TableCell>{data?.phone}</TableCell>
                                        <TableCell>{data?.role}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                data.createdAt,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Action
                                                deleteBtnClick={() =>
                                                    onOpen("staffDelete", {
                                                        staff: data,
                                                    })
                                                }
                                                editBtnClick={() =>
                                                    onOpen("staffEdit", {
                                                        staff: data,
                                                        page: page,
                                                        searchParameter: id,
                                                    })
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>

                    <Pagination
                        totalPage={datas?.totalPage}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
}
