"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const QueryProvider = ({ children }: { children: ReactNode }) => {
    const [queryclient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 3600 * 1000, // 1hr
                    },
                },
            }),
    );
    return (
        <QueryClientProvider client={queryclient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default QueryProvider;
