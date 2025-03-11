"use client";

import { Button } from "@/components/ui/button";
import { removeOrderFromJob } from "@/lib/api/job";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RemoveOrderFromJob({
    jobId,
    orderId,
}: {
    jobId: number;
    orderId: number;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    async function removeHandler() {
        try {
            setIsLoading(true);
            const { data } = await removeOrderFromJob(jobId, orderId);
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to remove order from job");
        } finally {
            setIsLoading(false);
            router.refresh();
        }
    }
    return (
        <Button
            className=""
            disabled={isLoading}
            variant={"destructive"}
            onClick={removeHandler}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                "Remove"
            )}
        </Button>
    );
}
