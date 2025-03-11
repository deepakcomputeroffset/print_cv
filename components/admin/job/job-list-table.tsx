import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MessageRow } from "@/components/message-row";
import { LoadingRow } from "@/components/loading-row";
import { job } from "@prisma/client";
import { Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useModal } from "@/hooks/use-modal";
import Link from "next/link";

export const JobListTable = ({
    jobs,
    isLoading,
}: {
    jobs: job[];
    isLoading: boolean;
}) => {
    const { onOpen } = useModal();
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>CreatedAt</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <LoadingRow text="Loading Jobs..." colSpan={8} />
                ) : jobs.length === 0 ? (
                    <MessageRow colSpan={8} text="No Job found" />
                ) : (
                    jobs?.map((job: job) => (
                        <TableRow key={job?.id}>
                            <TableCell className="text-center">
                                {job?.id}
                            </TableCell>
                            <TableCell className="font-medium">
                                {job?.name}
                            </TableCell>
                            <TableCell className="font-medium">
                                {job?.isVerified ? "Yes" : "No"}
                            </TableCell>

                            <TableCell>
                                {format(job?.createdAt, "dd/MM/yyyy")}
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center justify-end gap-2">
                                    <Link href={`/admin/job/${job?.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4 max-h-4 max-w-4" />
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            onOpen("editJob", {
                                                job,
                                            })
                                        }
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            onOpen("deleteJob", {
                                                job,
                                            });
                                        }}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
};
