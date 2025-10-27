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
import {
    order,
    job,
    staff,
    STATUS,
    task,
    taskType,
    attachment,
} from "@prisma/client";
import { MotionDiv } from "../../motionDiv";

interface TimelineEvent {
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
    startedAt?: string;
    completedAt: string;
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
        attachment?: attachment[];
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
                completedAt: baseDate.toLocaleDateString(),
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
                completedAt: improperDate.toLocaleDateString(),
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
                completedAt: cancelDate.toLocaleDateString(),
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
                            <User className="h-3.5 w-3.5" />
                            <span>Assigned to:</span>
                            <span className="font-medium text-gray-900">
                                {order?.attachment?.[0]?.uploadedById}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Uploaded:</span>
                            <span className="font-medium text-gray-900">
                                {format(fileDate, "MMM d, yyyy h:mm a")}
                            </span>
                        </div>
                    </div>
                ),
                completedAt: fileDate.toLocaleDateString(),
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
                            {startDate && (
                                <div className="flex items-center gap-2 mt-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Started:</span>
                                    <span className="font-medium text-gray-900">
                                        {format(
                                            startDate,
                                            "MMM d, yyyy h:mm a",
                                        )}
                                    </span>
                                </div>
                            )}
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
                        title: `${task.taskType?.name || "Task"}`,
                        description,
                        startedAt: format(startDate, "MMM d, yyyy"),
                        completedAt: format(startDate, "MMM d, yyyy"),
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
                completedAt: processedDate.toLocaleDateString(),
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
                completedAt: dispatchDate.toLocaleDateString(),
                status: "DISPATCHED",
            });
        }

        return events;
    };

    const timelineEvents = getTimelineEvents(order);

    return (
        <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
            <div className="p-4 md:p-8">
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

                <div className="relative">
                    {/* Center line: left on mobile, centered on sm+ */}
                    <div className="absolute left-0 sm:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20"></div>

                    <div className="relative space-y-5">
                        {timelineEvents?.map((event, index) => (
                            <div key={index}>
                                {/* Mobile layout: cards on right, center line on left */}
                                <MotionDiv
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.45,
                                        delay: index * 0.06,
                                    }}
                                    className="relative sm:hidden sm:px-2 px-4"
                                >
                                    {/* Dot (aligned to the center line on mobile) */}
                                    <div className="absolute -left-1.5 top-4 flex items-center">
                                        <div
                                            className={cn(
                                                "w-3.5 h-3.5 rounded-full z-10",
                                                event.status === "CANCELLED"
                                                    ? "bg-red-500"
                                                    : event.status ===
                                                        "IMPROPER_ORDER"
                                                      ? "bg-yellow-500"
                                                      : "bg-primary",
                                                "ring-4 ring-white",
                                            )}
                                        />
                                        {/* short connector to card */}
                                        <div
                                            className={cn(
                                                "ml-2 h-[2px] w-6",
                                                event.status === "CANCELLED"
                                                    ? "bg-red-200"
                                                    : event.status ===
                                                        "IMPROPER_ORDER"
                                                      ? "bg-yellow-200"
                                                      : "bg-primary/20",
                                            )}
                                        ></div>
                                    </div>

                                    <div className="ml-6">
                                        <div
                                            className={cn(
                                                "bg-white rounded-lg shadow-md border border-muted/40 overflow-hidden transition-all duration-200",
                                                "hover:shadow-lg hover:border-primary/20",
                                                event.status === "CANCELLED" &&
                                                    "border-red-200 hover:border-red-300",
                                                event.status ===
                                                    "IMPROPER_ORDER" &&
                                                    "border-yellow-200 hover:border-yellow-300",
                                            )}
                                        >
                                            <div className="p-4 pb-0 border-b border-muted/20 flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                                        event.status ===
                                                            "CANCELLED"
                                                            ? "bg-red-50 text-red-500"
                                                            : event.status ===
                                                                "IMPROPER_ORDER"
                                                              ? "bg-yellow-50 text-yellow-600"
                                                              : "bg-primary/10 text-primary",
                                                    )}
                                                >
                                                    {event.icon}
                                                </div>
                                                <h3 className="flex-1 text-base font-medium text-gray-900">
                                                    {event.title}
                                                </h3>
                                            </div>
                                            <div className="p-4 pt-2 bg-gradient-to-b from-transparent to-muted/5">
                                                <div className="text-sm text-gray-600">
                                                    {event.description}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </MotionDiv>

                                {/* Desktop layout (sm+): alternating left/right */}
                                <MotionDiv
                                    key={"d-" + index}
                                    initial={{
                                        opacity: 0,
                                        x: index % 2 === 0 ? -20 : 20,
                                    }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    className={cn(
                                        "hidden sm:flex items-center",
                                        index % 2 === 0
                                            ? "flex-row"
                                            : "flex-row-reverse",
                                    )}
                                >
                                    {/* Content Side */}
                                    <div
                                        className={cn(
                                            "w-[calc(50%-2rem)] group",
                                            index % 2 === 0 ? "pr-8" : "pl-8",
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "bg-white rounded-lg shadow-md border border-muted/40 overflow-hidden transition-all duration-200",
                                                "hover:shadow-lg hover:border-primary/20",
                                                event.status === "CANCELLED" &&
                                                    "border-red-200 hover:border-red-300",
                                                event.status ===
                                                    "IMPROPER_ORDER" &&
                                                    "border-yellow-200 hover:border-yellow-300",
                                            )}
                                        >
                                            {/* Card Header */}
                                            <div className="p-4 pb-0 border-b border-muted/20 flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                                        event.status ===
                                                            "CANCELLED"
                                                            ? "bg-red-50 text-red-500"
                                                            : event.status ===
                                                                "IMPROPER_ORDER"
                                                              ? "bg-yellow-50 text-yellow-600"
                                                              : "bg-primary/10 text-primary",
                                                    )}
                                                >
                                                    {event.icon}
                                                </div>
                                                <h3 className="flex-1 text-base font-medium text-gray-900">
                                                    {event.title}
                                                </h3>
                                            </div>
                                            {/* Card Content */}
                                            <div className="p-4 pt-2 bg-gradient-to-b from-transparent to-muted/5">
                                                <div className="text-sm text-gray-600">
                                                    {event.description}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Branch with connecting line */}
                                    <div className="relative flex items-center justify-center w-16">
                                        {/* Dot in center */}
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded-full z-10",
                                                event.status === "CANCELLED"
                                                    ? "bg-red-500"
                                                    : event.status ===
                                                        "IMPROPER_ORDER"
                                                      ? "bg-yellow-500"
                                                      : "bg-primary",
                                                "ring-4 ring-white",
                                            )}
                                        />
                                        {/* Horizontal connector line */}
                                        <div
                                            className={cn(
                                                "absolute h-[2px]",
                                                index % 2 === 0
                                                    ? "-left-2"
                                                    : "-right-2",
                                                "w-10",
                                                event.status === "CANCELLED"
                                                    ? "bg-red-200"
                                                    : event.status ===
                                                        "IMPROPER_ORDER"
                                                      ? "bg-yellow-200"
                                                      : "bg-primary/20",
                                            )}
                                        />
                                    </div>

                                    {/* Empty space for the other side */}
                                    <div className="w-[calc(50%-2rem)]"></div>
                                </MotionDiv>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
