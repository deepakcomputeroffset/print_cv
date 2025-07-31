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
import { Card } from "@/components/ui/card";
import { useDesignCategory } from "@/hooks/use-design-category";

export const DesignFilter = ({ filters }: { filters: QueryParams }) => {
    const { designCategories } = useDesignCategory({
        perpage: 100,
    });
    const [search, setSearch] = useState(filters?.search || "");
    const [sortOrder, setSortOrder] = useState<sortType | undefined>(
        filters?.sortorder,
    );

    const { setParam } = useUrlFilters();

    const debouncedSearch = useDebounce(search, 300);
    const debouncedSortOrder = useDebounce(sortOrder, 300);

    useEffect(() => {
        setParam("search", debouncedSearch);
        setParam("sortorder", debouncedSortOrder);
    }, [debouncedSearch, debouncedSortOrder, setParam]);

    return (
        <Card className="p-4 w-full">
            <div className="w-full flex gap-4 flex-wrap">
                <div className="flex flex-wrap w-full gap-2 ">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>

                    <Select
                        value={filters?.categoryId ?? "all"}
                        onValueChange={(v) => {
                            setParam("designCategoryId", v);
                        }}
                    >
                        <SelectTrigger className="w-full max-w-sm">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {designCategories?.map((dc) => (
                                <SelectItem
                                    key={dc.id}
                                    value={dc.id.toString()}
                                >
                                    {dc.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters?.sortby ?? "id"}
                        onValueChange={(value) => setParam("sortby", value)}
                    >
                        <SelectTrigger className="w-full !max-w-sm">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Sort By</SelectLabel>
                                <SelectItem value="id">Id</SelectItem>
                                <SelectItem value="is_availability">
                                    Availability
                                </SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="minPrice">
                                    Min Price
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Button
                        size={"icon"}
                        variant="outline"
                        className="w-full min-w-10 max-w-10"
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
                        <SelectTrigger className="w-full max-w-xs">
                            <SelectValue placeholder="Per Page" />
                        </SelectTrigger>
                        <SelectContent>
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
        </Card>
    );
};
