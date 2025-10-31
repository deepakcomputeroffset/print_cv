import { customerType } from "@/types/types";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { MessageRow } from "../../message-row";
import { CustomerTableRow } from "./customer-list-table-row";
import { LoadingRow } from "../../loaders/loading-row";

export const CustomerListTable = ({
    customers,
    toggleBanStatus,
    toggleVerifyStatus,
    isLoading,
}: {
    customers: customerType[];
    toggleBanStatus: (id: number) => void;
    toggleVerifyStatus: (id: number) => void;
    isLoading: boolean;
}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Customer Id</TableHead>
                    <TableHead>Customer Info</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <LoadingRow text="Loading customers..." colSpan={7} />
                ) : customers.length === 0 ? (
                    <MessageRow colSpan={7} text="No customers found" />
                ) : (
                    customers?.map((customer: customerType) => (
                        <CustomerTableRow
                            customer={customer}
                            key={customer?.id}
                            toggleBanStatus={toggleBanStatus}
                            toggleVerifyStatus={toggleVerifyStatus}
                        />
                    ))
                )}
            </TableBody>
        </Table>
    );
};
