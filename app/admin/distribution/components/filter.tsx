import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { QueryParams } from "@/types/types";
import { useDebounce } from "@/hooks/use-debounce";
import { useUrlFilters } from "@/hooks/useUrlFilter";
import { useEffect, useState } from "react";

export const CustomerFilterforDistributor = ({
    filters,
}: {
    filters: QueryParams;
}) => {
    const [search, setSearch] = useState(filters?.search || "");
    const debouncedSearch = useDebounce(search, 300);
    const { setParam } = useUrlFilters();

    useEffect(() => {
        setParam("search", debouncedSearch);
    }, [debouncedSearch, setParam]);

    return (
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            <div className="flex-1">
                <div className="relative min-w-28">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>
        </div>
    );
};
