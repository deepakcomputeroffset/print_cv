import { TableCell, TableRow } from "@/components/ui/table";

export const MessageRow = ({
    text,
    colSpan = 6,
}: {
    text: string;
    colSpan?: number;
}) => {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="text-center py-8">
                {text}
            </TableCell>
        </TableRow>
    );
};
