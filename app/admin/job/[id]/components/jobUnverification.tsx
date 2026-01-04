"use client";

import { Button } from "@/components/ui/button";
import { jobUnverification } from "@/lib/api/job";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function JobUnverification({ jobId }: { jobId: number }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    async function handleUnverify() {
        try {
            if (!jobId) {
                toast.error("Job ID is required.");
                return;
            }
            setIsLoading(true);
            const { data } = await jobUnverification(jobId);
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to unverify job");
        } finally {
            setIsLoading(false);
            router.refresh();
        }
    }
    return (
        <Button variant="outline" disabled={isLoading} onClick={handleUnverify}>
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                "Unverify Job"
            )}
        </Button>
    );
}
