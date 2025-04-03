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
    ClipboardCheck,
    PackageCheck,
    PackageOpen,
    Factory,
    Boxes,
    ScrollText,
    UserCheck,
    Printer,
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
                    <div className="mt-2 space-y-2">
                        <div className="flex flex-col text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Started:</span>
                                <span className="font-medium text-gray-900">
                                    {format(baseDate, "MMM d, yyyy h:mm a")}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                                <ClipboardCheck className="h-3.5 w-3.5" />
                                <span>Completed:</span>
                                <span className="font-medium text-gray-900">
                                    {format(
                                        order?.createdAt,
                                        "dd MMM yyyy h:mm a",
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                ),
                date: baseDate.toLocaleDateString(),
                status: "PENDING",
            },
        ];

        if (order.status === "CANCELLED") {
            const cancelDate = new Date(order?.updatedAt);
            events.push({
                icon: <XCircle className="h-6 w-6" />,
                title: "Order Cancelled",
                description: (
                    <div className="mt-2 space-y-2">
                        <div className="flex flex-col text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Started:</span>
                                <span className="font-medium text-gray-900">
                                    {format(cancelDate, "MMM d, yyyy h:mm a")}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Cancelled:</span>
                                <span className="font-medium text-gray-900">
                                    {format(cancelDate, "MMM d, yyyy h:mm a")}
                                </span>
                            </div>
                        </div>
                    </div>
                ),
                date: cancelDate.toLocaleDateString(),
                status: "CANCELLED",
            });
        } else if (order.job?.tasks) {
            order.job.tasks
                .filter((task) => task.status !== "PENDING")
                .forEach((task) => {
                    if (task.assignee) {
                        const startDate = task.startedAt
                            ? new Date(task.startedAt)
                            : baseDate;
                        const completionDate = task.completedAt
                            ? new Date(task.completedAt)
                            : null;

                        const getTaskIcon = (
                            taskType: string | undefined,
                            status: string,
                        ) => {
                            if (status === "COMPLETED")
                                return <PackageCheck className="h-6 w-6" />;
                            if (status === "IN_PROGRESS") {
                                switch (taskType?.toLowerCase()) {
                                    case "ctp":
                                        return <Factory className="h-6 w-6" />;
                                    case "printing":
                                        return <Printer className="h-6 w-6" />;
                                    case "packaging":
                                        return (
                                            <PackageOpen className="h-6 w-6" />
                                        );
                                    case "quality check":
                                        return (
                                            <ScrollText className="h-6 w-6" />
                                        );
                                    default:
                                        return <Boxes className="h-6 w-6" />;
                                }
                            }
                            return <UserCheck className="h-6 w-6" />;
                        };

                        const description = (
                            <div className="mt-2 space-y-2">
                                <div className="flex flex-col text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>Started:</span>
                                        <span className="font-medium text-gray-900">
                                            {format(
                                                startDate,
                                                "MMM d, yyyy h:mm a",
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                                        <User className="h-3.5 w-3.5" />
                                        <span>Assigned to:</span>
                                        <span className="font-medium text-gray-900">
                                            {task.assignee.name}
                                        </span>
                                    </div>
                                    {completionDate && (
                                        <div className="flex items-center gap-2 text-gray-600 mt-1">
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
                            </div>
                        );

                        events.push({
                            icon: getTaskIcon(task.taskType?.name, task.status),
                            title: `Task Assigned: ${task.taskType?.name || "Processing Task"}`,
                            description,
                            date: completionDate
                                ? format(completionDate, "MMM d, yyyy")
                                : format(startDate, "MMM d, yyyy"),
                            status:
                                task.status === "COMPLETED"
                                    ? "DISPATCHED"
                                    : "PROCESSING",
                        });
                    }
                });

            if (order.job.isCompleted) {
                const completionDate = new Date(
                    baseDate.getTime() +
                        (order.job.tasks.length + 1) * 24 * 60 * 60 * 1000,
                );
                events.push({
                    icon: <PackageCheck className="h-6 w-6" />,
                    title: "Order Completed",
                    description: (
                        <div className="mt-2 space-y-2">
                            <div className="flex flex-col text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>Started:</span>
                                    <span className="font-medium text-gray-900">
                                        {format(baseDate, "MMM d, yyyy h:mm a")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Completed:</span>
                                    <span className="font-medium text-gray-900">
                                        {format(
                                            completionDate,
                                            "MMM d, yyyy h:mm a",
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ),
                    date: completionDate.toLocaleDateString(),
                    status: "DISPATCHED",
                });
            }

            if (order.status === "DISPATCHED") {
                const dispatchDate = new Date(
                    baseDate.getTime() +
                        (order.job.tasks.length + 2) * 24 * 60 * 60 * 1000,
                );
                events.push({
                    icon: <Truck className="h-6 w-6" />,
                    title: "Order Dispatched",
                    description: (
                        <div className="mt-2 space-y-2">
                            <div className="flex flex-col text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>Started:</span>
                                    <span className="font-medium text-gray-900">
                                        {format(baseDate, "MMM d, yyyy h:mm a")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                    <Truck className="h-3.5 w-3.5" />
                                    <span>Dispatched:</span>
                                    <span className="font-medium text-gray-900">
                                        {format(
                                            dispatchDate,
                                            "MMM d, yyyy h:mm a",
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ),
                    date: dispatchDate.toLocaleDateString(),
                    status: "DISPATCHED",
                });
            }
        }

        return events;
    };

    const timelineEvents = getTimelineEvents(order);
    const currentStatusIndex = timelineEvents.length - 1;

    let activeStatusIndex = 0;
    if (order.status === "PROCESSING") {
        if (order.job?.tasks) {
            const completedTasks = order.job.tasks.filter(
                (task) => task.status === "COMPLETED",
            ).length;
            activeStatusIndex = completedTasks * 2;
        } else {
            activeStatusIndex = Math.min(3, currentStatusIndex);
        }
    } else if (order.status === "DISPATCHED") {
        activeStatusIndex = currentStatusIndex;
    } else if (order.status === "CANCELLED") {
        activeStatusIndex = 1;
    }

    return (
        <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
            <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-primary/60"></div>
                    <h2
                        className={cn(
                            "text-xl md:text-2xl font-semibold text-gray-900",
                            sourceSerif4.className,
                        )}
                    >
                        Order Progress
                    </h2>
                </div>

                <div className="relative">
                    {timelineEvents.map((event, index) => {
                        const isActive = index <= activeStatusIndex;
                        const isCancelled = event.status === "CANCELLED";
                        const isLast = index === timelineEvents.length - 1;

                        return (
                            <MotionDiv
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className={cn(
                                    "mb-8 last:mb-0",
                                    isLast && "pb-2",
                                )}
                            >
                                <div className="flex items-start relative">
                                    <MotionDiv
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: isActive ? 1 : 0.8 }}
                                        className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 z-10",
                                            isCancelled
                                                ? "bg-red-50 text-red-500 shadow-red-100"
                                                : isActive
                                                  ? "bg-primary/10 text-primary shadow-primary/20"
                                                  : "bg-gray-50 text-gray-400 shadow-gray-100",
                                            isActive &&
                                                "ring-2 ring-offset-2 ring-primary/20",
                                        )}
                                    >
                                        {event.icon}
                                    </MotionDiv>

                                    <div className="ml-6 flex-1">
                                        <MotionDiv
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.1 + 0.2,
                                            }}
                                        >
                                            <h3
                                                className={cn(
                                                    "text-lg font-medium mb-2",
                                                    isCancelled
                                                        ? "text-red-600"
                                                        : isActive
                                                          ? "text-gray-900"
                                                          : "text-gray-500",
                                                )}
                                            >
                                                {event.title}
                                            </h3>
                                            <div
                                                className={cn(
                                                    "bg-gray-50/50 rounded-lg p-4 border transition-colors duration-200",
                                                    isCancelled
                                                        ? "border-red-100"
                                                        : isActive
                                                          ? "border-primary/10"
                                                          : "border-gray-100",
                                                    isActive &&
                                                        "hover:border-primary/20",
                                                )}
                                            >
                                                {event.description}
                                            </div>
                                        </MotionDiv>
                                    </div>
                                </div>

                                {index < timelineEvents.length - 1 &&
                                    event.status !== "DISPATCHED" &&
                                    ![
                                        "Order Completed",
                                        "Order Dispatched",
                                    ].includes(event.title) && (
                                        <div className="absolute left-6 w-[1px] h-[calc(100%-20px)] top-12">
                                            <div
                                                className={cn(
                                                    "w-full h-full",
                                                    isCancelled
                                                        ? "bg-red-100"
                                                        : isActive
                                                          ? "bg-gradient-to-b from-primary/20 to-transparent"
                                                          : "bg-gray-100",
                                                )}
                                            />
                                        </div>
                                    )}
                            </MotionDiv>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
