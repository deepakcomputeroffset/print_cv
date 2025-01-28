import { TableCell, TableRow } from "@/components/ui/table";

export const MessageRow = ({ text }: { text: string }) => {
    return (
        <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
                {text}
            </TableCell>
        </TableRow>
    );
};
