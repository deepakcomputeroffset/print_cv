import { CustomerQueryParams } from "@/lib/api/customers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useUrlFilters = () => {
    const { replace } = useRouter();
    const path = usePathname();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams!);

    // params.set(data);
    const setParam = <
        K extends keyof CustomerQueryParams,
        V extends CustomerQueryParams[K],
    >(
        key: K,
        value: V,
    ) => {
        params.set(key, `${value}`);
        replace(`${path}?${params}`);
    };
    return {
        setParam,
    };
};
