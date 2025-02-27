"use client";

import { useWallet } from "@/hooks/use-wallet";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

export const Wallet = ({ session }: { session: Session }) => {
    const {
        data: wallet,
        refetch,
        isLoading,
    } = useWallet(session?.user?.customer?.wallet);
    return (
        <div className="flex gap-2 items-center">
            <span>Wallet : </span>
            <span className="align-middle text-center">{wallet?.balance}</span>
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
};
