"use client";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { QueryParams, sortType } from "@/types/types";
import { useDebounce } from "@/hooks/use-debounce";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { useEffect, useState } from "react";
import { getAllProductCategory } from "@/lib/get-categories";
import { useProductCategory } from "@/hooks/use-product-categories";
import { Card } from "../ui/card";

export const ProductFilter = ({ filters }: { filters: QueryParams }) => {
    const { productCategories } = useProductCategory({
        perpage: 100,
    });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [search, setSearch] = useState(filters?.search || "");
    const [sortOrder, setSortOrder] = useState<sortType | undefined>(
        filters?.sortorder,
    );
    const [priceRange, setPriceRange] = useState({
        min: filters?.min_price,
        max: filters?.max_price,
    });
    const { setParam } = useUrlFilters();
    const [minQty, setMinQty] = useState(filters?.min_qty);

    const debouncedSearch = useDebounce(search, 300);
    const debouncedSortOrder = useDebounce(sortOrder, 300);
    const debouncedPriceRange = useDebounce(priceRange, 300);
    const debouncedMinQty = useDebounce(minQty, 300);

    useEffect(() => {
        setParam("search", debouncedSearch);
        setParam("sortorder", debouncedSortOrder);
        if (!!minQty) setParam("min_qty", minQty);
        if (!!priceRange?.min) setParam("min_price", priceRange?.min);
        if (!!priceRange?.max) setParam("max_price", priceRange?.max);
    }, [
        debouncedSearch,
        debouncedSortOrder,
        debouncedMinQty,
        debouncedPriceRange,
        setParam,
    ]);

    return (
        <Card className="p-4 w-full">
            <div className="w-full flex gap-4 flex-wrap">
                <div className="grid grid-cols-1 md:grid-cols-4 w-full gap-2 flex-wrap">
                    <div className="w-full">
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

                    <Select
                        value={filters?.category_id ?? "all"}
                        onValueChange={(v) => {
                            setParam("category_id", v);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="all">All</SelectItem>
                            {getAllProductCategory(productCategories, 0)}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters?.is_avialable ?? "all"}
                        onValueChange={(value) =>
                            setParam(
                                "is_avialable",
                                value as "all" | "false" | "true",
                            )
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by availability" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="true">Available</SelectItem>
                            <SelectItem value="false">Unavailable</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                            setShowAdvancedFilters(!showAdvancedFilters)
                        }
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Advanced Filters
                    </Button>
                </div>

                {showAdvancedFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t w-full">
                        <div className="flex items-center space-x-2 w-full">
                            <Input
                                type="number"
                                placeholder="Min price"
                                value={priceRange.min}
                                min={0}
                                onChange={(e) =>
                                    setPriceRange((prev) => ({
                                        ...prev,
                                        min: Number(e.target.value),
                                    }))
                                }
                                className="w-full"
                            />
                            <span>-</span>
                            <Input
                                type="number"
                                placeholder="Max price"
                                value={priceRange.max}
                                min={0}
                                onChange={(e) =>
                                    setPriceRange((prev) => ({
                                        ...prev,
                                        max: Number(e.target.value),
                                    }))
                                }
                                className="w-full"
                            />
                        </div>

                        <Input
                            type="number"
                            className="w-full"
                            placeholder="Minimum quantity"
                            min={0}
                            value={minQty}
                            onChange={(e) => setMinQty(Number(e.target.value))}
                        />

                        <div className="flex space-x-2 w-full">
                            <Select
                                value={filters?.sortby ?? "id"}
                                onValueChange={(value) =>
                                    setParam("sortby", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Sort By</SelectLabel>
                                        <SelectItem value="id">Id</SelectItem>
                                        <SelectItem value="is_availability">
                                            Availability
                                        </SelectItem>
                                        <SelectItem value="name">
                                            Name
                                        </SelectItem>
                                        <SelectItem value="min_price">
                                            Min Price
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                onClick={() =>
                                    setSortOrder(
                                        sortOrder == "asc" ? "desc" : "asc",
                                    )
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
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Per Page</SelectLabel>
                                        {process.env.NODE_ENV ===
                                            "development" && (
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
                )}
            </div>
        </Card>
    );
};
