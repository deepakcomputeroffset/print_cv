"use client";

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

interface SalesChartProps {
    data: {
        name: string;
        total: number;
    }[];
}

export function SalesChart({ data }: SalesChartProps) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--gmail-border))"
                    vertical={false}
                />
                <XAxis
                    dataKey="name"
                    stroke="hsl(var(--gmail-text-secondary))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="hsl(var(--gmail-text-secondary))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        border: "1px solid hsl(var(--gmail-border))",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                        fontSize: "13px",
                    }}
                    formatter={(value: number) => [
                        `₹${value.toLocaleString()}`,
                        "Revenue",
                    ]}
                    cursor={{ fill: "hsl(var(--gmail-hover))" }}
                />
                <Bar
                    dataKey="total"
                    fill="hsl(var(--gmail-blue))"
                    radius={[6, 6, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
