import { QueryParams } from "@/types/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useUrlFilters = () => {
    const { replace } = useRouter();
    const path = usePathname();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams!);

    // params.set(data);
    const setParam = useCallback(
        <K extends keyof QueryParams, V extends QueryParams[K]>(
            key: K,
            value: V,
        ) => {
            params.set(key, `${value}`);
            replace(`${path}?${params}`);
        },
        [],
    );
    return {
        setParam,
    };
};
