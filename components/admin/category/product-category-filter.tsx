import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { Search } from "lucide-react";
import { Button } from "../../ui/button";
import { QueryParams, sortType } from "@/types/types";
import { useDebounce } from "@/hooks/use-debounce";
import { useUrlFilters } from "@/hooks/useUrlFilter";
import { useEffect, useState } from "react";

export const ProductCategoryFilter = ({
    filters,
}: {
    filters: QueryParams;
}) => {
    const [search, setSearch] = useState(filters?.search || "");
    const [sortOrder, setSortOrder] = useState<sortType | undefined>(
        filters?.sortorder,
    );
    const debouncedSearch = useDebounce(search, 300);
    const debouncedSortOrder = useDebounce(sortOrder, 300);
    const { setParam } = useUrlFilters();

    useEffect(() => {
        setParam("search", debouncedSearch);
        setParam("sortorder", debouncedSortOrder);
    }, [debouncedSearch, debouncedSortOrder, setParam]);

    return (
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            <div className="flex-1">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>
            <div className="flex justify-between gap-3">
                <Select
                    value={filters?.sortby || "id"}
                    onValueChange={(value) => setParam("sortby", value)}
                >
                    <SelectTrigger className="md:min-w-[180px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort By</SelectLabel>
                            <SelectItem value="id">Id</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    onClick={() =>
                        setSortOrder(sortOrder == "asc" ? "desc" : "asc")
                    }
                >
                    {sortOrder === "desc" ? "↑" : "↓"}
                </Button>

                <Select
                    value={`${filters?.perpage || "100"}`}
                    onValueChange={(value) =>
                        setParam("perpage", Number(value))
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Per Page" />
                    </SelectTrigger>
                    <SelectContent className="md:w-[180px]">
                        <SelectGroup>
                            <SelectLabel>Per Page</SelectLabel>
                            {process.env.NODE_ENV === "development" && (
                                <SelectItem value="1">1</SelectItem>
                            )}
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="200">200</SelectItem>
                            <SelectItem value="400">400</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
