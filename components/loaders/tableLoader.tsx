import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

interface TableLoaderProps extends React.HTMLAttributes<HTMLTableElement> {
    rows?: number;
    cols?: number;
}

export default function TableLoader({
    rows = 5,
    cols = 5,
    className,
    ...props
}: TableLoaderProps) {
    return (
        <Table className={cn(className)} {...props}>
            <TableBody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {Array.from({ length: cols }).map((_, colIndex) => (
                            <TableCell key={colIndex} className="h-12">
                                <Skeleton className="w-full h-full" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
