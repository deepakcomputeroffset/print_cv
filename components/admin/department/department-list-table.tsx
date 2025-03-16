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
import { taskType } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useModal } from "@/hooks/use-modal";

export const DepartmentListTable = ({
    departments,
    isLoading,
}: {
    departments: taskType[];
    isLoading: boolean;
}) => {
    const { onOpen } = useModal();
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>CreatedAt</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <LoadingRow text="Loading Departments..." colSpan={8} />
                ) : departments.length === 0 ? (
                    <MessageRow colSpan={8} text="No Departments found" />
                ) : (
                    departments?.map((taskType: taskType) => (
                        <TableRow key={taskType?.id}>
                            <TableCell className="text-center">
                                {taskType?.id}
                            </TableCell>
                            <TableCell className="font-medium">
                                {taskType?.name}
                            </TableCell>

                            <TableCell>{taskType?.description}</TableCell>
                            <TableCell>
                                {format(taskType?.createdAt, "dd/MM/yyyy")}
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            onOpen("editTaskType", {
                                                taskType,
                                            })
                                        }
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            onOpen("deleteTaskType", {
                                                taskType,
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
