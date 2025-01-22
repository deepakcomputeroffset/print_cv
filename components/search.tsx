"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FC, HTMLAttributes } from "react";

interface pageProps extends HTMLAttributes<HTMLInputElement> {
    queryName: string;
    placeholder?: string;
}

export const SearchBar: FC<pageProps> = ({
    queryName,
    placeholder,
    className,

    ...props
}) => {
    const { replace } = useRouter();
    const path = usePathname();
    const params = useSearchParams();
    const query = new URLSearchParams(params!);

    let timer: NodeJS.Timeout;
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (e.target.value) {
                query.set(queryName, e.target.value);
                query.set("page", "1");
            } else {
                query.delete("page");
                query.delete(queryName);
            }
            replace(`${path}?${query}`);
        }, 300);
    };

    return (
        <div className="relative w-64">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                {...props}
                placeholder={placeholder || "Search staffs by."}
                className={cn("pl-8", className)}
                onChange={onChange}
                defaultValue={params?.get(queryName) as string}
            />
        </div>
    );
};
