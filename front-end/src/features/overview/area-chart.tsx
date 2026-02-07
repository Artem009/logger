import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ErrorEntry } from "@/types/error";
import { useMemo } from "react";

const chartConfig = {
  errors: {
    label: "Errors",
    color: "var(--chart-1)",
  },
  occurrences: {
    label: "Occurrences",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ErrorsAreaChartProps {
  errors: ErrorEntry[];
}

export function ErrorsAreaChart({ errors }: ErrorsAreaChartProps) {
  const chartData = useMemo(() => {
    const grouped = new Map<string, { errors: number; occurrences: number }>();

    for (const error of errors) {
      const date = new Date(error.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const existing = grouped.get(date) || { errors: 0, occurrences: 0 };
      existing.errors += 1;
      existing.occurrences += error.counter;
      grouped.set(date, existing);
    }

    return Array.from(grouped.entries())
      .map(([date, data]) => ({ date, ...data }))
      .slice(-14); // Last 14 days max
  }, [errors]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No error data to display
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="occurrences"
          type="natural"
          fill="var(--color-occurrences)"
          fillOpacity={0.4}
          stroke="var(--color-occurrences)"
          stackId="a"
        />
        <Area
          dataKey="errors"
          type="natural"
          fill="var(--color-errors)"
          fillOpacity={0.4}
          stroke="var(--color-errors)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
