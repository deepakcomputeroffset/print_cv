import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { MessageRow } from "../message-row";
import { StaffTableRow } from "./staff-list-table-row";
import { LoadingRow } from "../loading-row";
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
                    <LoadingRow text="Loading customers..." />
                ) : customers.length === 0 ? (
                    <MessageRow text="No customers found" />
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
