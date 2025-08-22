import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    ShoppingCart,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    User,
    PackageCheck,
    Boxes,
    Upload,
    AlertTriangle,
} from "lucide-react";
import { order, job, staff, STATUS, task, taskType } from "@prisma/client";
import { MotionDiv } from "../../motionDiv";

interface TimelineEvent {
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
    date: string;
    status: STATUS;
}

interface OrderTimelineProps {
    order: order & {
        job:
            | (job & {
                  staff: Pick<staff, "id" | "name"> | null;
                  tasks: (task & {
                      taskType: taskType | null;
                      assignee: Pick<staff, "id" | "name"> | null;
                  })[];
              })
            | null;
    };
}

export function OrderTimeline({ order }: OrderTimelineProps) {
    const getTimelineEvents = (
        order: OrderTimelineProps["order"],
    ): TimelineEvent[] => {
        const baseDate = new Date(order?.createdAt);
        const events: TimelineEvent[] = [
            {
                icon: <ShoppingCart className="h-6 w-6" />,
                title: "Order Placed",
                description: (
                    <div className="flex flex-col text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>At:</span>
                            <span className="font-medium text-gray-900">
                                {format(baseDate, "MMM d, yyyy h:mm a")}
                            </span>
                        </div>
                    </div>
                ),
                date: baseDate.toLocaleDateString(),
                status: "PLACED",
            },
        ];

        if (order.status === "IMPROPER_ORDER") {
            const improperDate = new Date(order?.updatedAt);
            events.push({
                icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
                title: "Improper Order",
                description: (
                    <div className="flex flex-col text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Flagged:</span>
                            <span className="font-medium text-gray-900">
                                {format(improperDate, "MMM d, yyyy h:mm a")}
                            </span>
                        </div>
                    </div>
                ),
                date: improperDate.toLocaleDateString(),
                status: "IMPROPER_ORDER",
            });
            return events;
        }

        if (order.status === "CANCELLED") {
            const cancelDate = new Date(order?.updatedAt);
            events.push({
                icon: <XCircle className="h-6 w-6" />,
                title: "Order Cancelled",
                description: (
                    <div className="flex flex-col text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Cancelled:</span>
                            <span className="font-medium text-gray-900">
                                {format(cancelDate, "MMM d, yyyy h:mm a")}
                            </span>
                        </div>
                    </div>
                ),
                date: cancelDate.toLocaleDateString(),
                status: "CANCELLED",
            });
            return events;
        }

        // FILE UPLOADED step
        if (order.status !== "PLACED") {
            const fileDate = new Date(order?.updatedAt);
            events.push({
                icon: <Upload className="h-6 w-6" />,
                title: "File Uploaded",
                description: (
                    <div className="flex flex-col text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Uploaded:</span>
                            <span className="font-medium text-gray-900">
                                {format(fileDate, "MMM d, yyyy h:mm a")}
                            </span>
                        </div>
                    </div>
                ),
                date: fileDate.toLocaleDateString(),
                status: "FILE_UPLOADED",
            });
        }

        // Job tasks (PROCESSING)
        if (order.job?.tasks) {
            order.job.tasks
                .filter((task) => task.status !== "PENDING")
                .forEach((task) => {
                    const startDate = task.startedAt
                        ? new Date(task.startedAt)
                        : baseDate;
                    const completionDate = task.completedAt
                        ? new Date(task.completedAt)
                        : null;

                    const description = (
                        <div className="flex flex-col text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5" />
                                <span>Assigned to:</span>
                                <span className="font-medium text-gray-900">
                                    {task.assignee?.name}
                                </span>
                            </div>
                            {completionDate && (
                                <div className="flex items-center gap-2 mt-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Completed:</span>
                                    <span className="font-medium text-gray-900">
                                        {format(
                                            completionDate,
                                            "MMM d, yyyy h:mm a",
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    );

                    events.push({
                        icon: <Boxes className="h-6 w-6" />,
                        title: `Processing: ${task.taskType?.name || "Task"}`,
                        description,
                        date: completionDate
                            ? format(completionDate, "MMM d, yyyy")
                            : format(startDate, "MMM d, yyyy"),
                        status: "PROCESSING",
                    });
                });
        }

        // PROCESSED
        if (order.status === "PROCESSED" || order.status === "DISPATCHED") {
            const processedDate = new Date(order?.updatedAt);
            events.push({
                icon: <PackageCheck className="h-6 w-6" />,
                title: "Order Processed",
                description: (
                    <div className="flex flex-col text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Processed:</span>
                            <span className="font-medium text-gray-900">
                                {format(processedDate, "MMM d, yyyy h:mm a")}
                            </span>
                        </div>
                    </div>
                ),
                date: processedDate.toLocaleDateString(),
                status: "PROCESSED",
            });
        }

        // DISPATCHED
        if (order.status === "DISPATCHED") {
            const dispatchDate = new Date(order?.updatedAt);
            events.push({
                icon: <Truck className="h-6 w-6" />,
                title: "Order Dispatched",
                description: (
                    <div className="flex flex-col text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Truck className="h-3.5 w-3.5" />
                            <span>Dispatched:</span>
                            <span className="font-medium text-gray-900">
                                {format(dispatchDate, "MMM d, yyyy h:mm a")}
                            </span>
                        </div>
                    </div>
                ),
                date: dispatchDate.toLocaleDateString(),
                status: "DISPATCHED",
            });
        }

        return events;
    };

    const timelineEvents = getTimelineEvents(order);

    return (
        <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
            <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-primary/60"></div>
                    <h2
                        className={cn(
                            "text-lg md:text-xl font-semibold text-gray-900",
                            sourceSerif4.className,
                        )}
                    >
                        Order Progress
                    </h2>
                </div>

                <div className="relative space-y-6">
                    {timelineEvents.map((event, index) => (
                        <MotionDiv
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-start gap-4"
                        >
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shadow-sm",
                                    event.status === "CANCELLED"
                                        ? "bg-red-50 text-red-500"
                                        : event.status === "IMPROPER_ORDER"
                                          ? "bg-yellow-50 text-yellow-600"
                                          : "bg-primary/10 text-primary",
                                )}
                            >
                                {event.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-900">
                                    {event.title}
                                </h3>
                                <div className="mt-1 text-xs text-gray-600">
                                    {event.description}
                                </div>
                            </div>
                        </MotionDiv>
                    ))}
                </div>
            </div>
        </div>
    );
}
