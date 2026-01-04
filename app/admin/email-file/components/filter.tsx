"use client";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QueryParams, sortType } from "@/types/types";
import { useDebounce } from "@/hooks/use-debounce";
import { useUrlFilters } from "@/hooks/useUrlFilter";
import { useEffect, useState } from "react";

export function OrdersFilter({ filters }: { filters: QueryParams }) {
    const [search, setSearch] = useState(filters?.search || "");
    const [sortOrder, setSortOrder] = useState<sortType>(
        filters?.sortorder !== undefined ? filters?.sortorder : "desc",
    );
    const debouncedSearch = useDebounce(search, 300);
    const debouncedSortOrder = useDebounce(sortOrder, 300);
    const { setParam } = useUrlFilters();

    useEffect(() => {
        setParam("search", debouncedSearch);
        setParam("sortorder", debouncedSortOrder);
    }, [debouncedSearch, debouncedSortOrder, setParam]);

    return (
        <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative min-w-28">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search Orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <div className="flex space-x-2">
                    <Select
                        value={filters?.sortby || "date"}
                        onValueChange={(value) => setParam("sortby", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="amount">Amount</SelectItem>
                            <SelectItem value="quantity">Quantity</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                    >
                        {sortOrder === "asc" ? "↑" : "↓"}
                    </Button>
                </div>
                <Select
                    value={`${filters?.perpage || "100"}`}
                    onValueChange={(value) =>
                        setParam("perpage", Number(value))
                    }
                >
                    <SelectTrigger className="max-w-28">
                        <SelectValue placeholder="Per Page" />
                    </SelectTrigger>
                    <SelectContent className="max-w-28">
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
}
