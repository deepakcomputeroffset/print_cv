import { Loader2 } from "lucide-react";
import { TableCell, TableRow } from "./ui/table";

export const LoadingRow = ({ text }: { text: string }) => {
    return (
        <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
                <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    {text}
                </div>
            </TableCell>
        </TableRow>
    );
};
