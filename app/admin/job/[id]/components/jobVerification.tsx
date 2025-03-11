"use client";

import { Button } from "@/components/ui/button";
import { jobVerification } from "@/lib/api/job";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function JobVerification({ jobId }: { jobId: number }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    async function handleVerify() {
        try {
            if (!jobId) {
                toast.error("Job ID is required.");
                return;
            }
            setIsLoading(true);
            const { data } = await jobVerification(jobId);
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to verify job");
        } finally {
            setIsLoading(false);
            router.refresh();
        }
    }
    return (
        <Button disabled={isLoading} onClick={handleVerify}>
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                "Verify Job"
            )}
        </Button>
    );
}
