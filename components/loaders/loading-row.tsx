import { Loader2 } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";

export const LoadingRow = ({
    text,
    colSpan = 6,
}: {
    text: string;
    colSpan?: number;
}) => {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="text-center py-8">
                <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    {text}
                </div>
            </TableCell>
        </TableRow>
    );
};
