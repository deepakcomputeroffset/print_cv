"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CompleteJobButton({ jobId }: { jobId: number }) {
    const router = useRouter();

    const handleComplete = async () => {
        try {
            const response = await fetch(`/api/jobs/${jobId}/complete`, {
                method: "PATCH",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to complete job");
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
