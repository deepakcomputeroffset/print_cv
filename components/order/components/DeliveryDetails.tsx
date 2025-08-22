import { Truck } from "lucide-react";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { order } from "@prisma/client";
import { addressType } from "@/types/types";

interface DeliveryDetailsProps {
    order: order & {
        customer: {
            address?: addressType;
            businessName: string;
            name: string;
            phone: string;
        };
    };
}

export function DeliveryDetails({ order }: DeliveryDetailsProps) {
    return (
        <div>
            <h2
                className={cn(
                    "text-lg font-semibold mb-4 flex items-center text-gray-800",
                    sourceSerif4.className,
                )}
            >
                <Truck className="h-5 w-5 mr-2 text-primary/70" />
                Delivery Details
            </h2>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                    <h3 className="text-sm text-gray-500 mb-1">
                        Business Details
                    </h3>
                    <div className="font-medium text-gray-800">
                        {order?.customer?.businessName}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                        Contact: {order?.customer?.name}
                    </div>
                    <div className="text-gray-600 text-sm">
                        Phone: {order?.customer?.phone}
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="text-sm text-gray-500 mb-1">
                        Shipping Address
                    </h3>
                    <div className="text-gray-800">
                        {order?.customer?.address?.line}
                    </div>
                    <div className="text-gray-800">
                        {order?.customer?.address?.city?.name},{" "}
                        {order?.customer?.address?.city?.state?.name}{" "}
                        {order?.customer?.address?.pinCode}
                    </div>
                    <div className="text-gray-800">
                        {order?.customer?.address?.city?.state?.country?.name}
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        variant="outline"
                        className="w-full border-primary/20 text-primary hover:bg-primary/5"
                    >
                        View Shipping Details
                    </Button>
                </div>
            </div>
        </div>
    );
}
