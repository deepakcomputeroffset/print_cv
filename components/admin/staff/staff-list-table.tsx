import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MessageRow } from "@/components/message-row";
import { StaffTableRow } from "./staff-list-table-row";
import { LoadingRow } from "@/components/loading-row";
import { staff } from "@prisma/client";

export const StaffListTable = ({
    customers,
    toggleBanStatus,
    isLoading,
}: {
    customers: staff[];
    toggleBanStatus: (id: number) => void;
    isLoading: boolean;
}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <LoadingRow text="Loading staffs..." colSpan={8} />
                ) : customers.length === 0 ? (
                    <MessageRow colSpan={8} text="No staffs found" />
                ) : (
                    customers?.map((staff: staff) => (
                        <StaffTableRow
                            staff={staff}
                            key={staff?.id}
                            toggleBanStatus={toggleBanStatus}
                        />
                    ))
                )}
            </TableBody>
        </Table>
    );
};
