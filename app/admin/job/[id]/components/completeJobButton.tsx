"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { ServerResponseType } from "@/types/types";

export default function CompleteJobButton({ jobId }: { jobId: number }) {
    const router = useRouter();

    const handleComplete = async () => {
        try {
            const { data } = await axios.post<ServerResponseType<null>>(
                `/api/job/${jobId}/complete`,
            );

            if (!data.success) {
                throw new Error(data.message || "Failed to complete job");
            }

            toast.success(data.message);
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "An error occurred",
            );
        }
    };

    return <Button onClick={handleComplete}>Mark as Completed</Button>;
}
