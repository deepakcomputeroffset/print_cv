"use client";

import { useWallet } from "@/hooks/use-wallet";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { NUMBER_PRECISION } from "@/lib/constants";

export default function Wallet({ session }: { session: Session }) {
    const {
        data: wallet,
        refetch,
        isLoading,
    } = useWallet(session?.user?.customer?.wallet);
    return (
        <div className="flex gap-2 items-center">
            <span>Wallet : </span>
            <span className="align-middle text-center text-[13px]">
                {wallet?.balance.toFixed(NUMBER_PRECISION)}
            </span>
            <Button
                variant={"secondary"}
                size={"sm"}
                className="ml-auto"
                disabled={isLoading}
                onClick={() => refetch()}
            >
                <RotateCw className={isLoading ? "animate-spin" : ""} />
            </Button>
        </div>
    );
}
