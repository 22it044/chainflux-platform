
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  isLoading?: boolean;
}

export function DashboardCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
  isLoading = false,
}: DashboardCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="w-20 h-9 bg-muted/60 rounded animate-pulse" />
            {description && <div className="w-28 h-4 bg-muted/60 rounded animate-pulse" />}
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {(description || trend) && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                {trend && (
                  <span
                    className={cn(
                      "inline-flex items-center mr-1",
                      trend === "up" && "text-green-500",
                      trend === "down" && "text-red-500"
                    )}
                  >
                    {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
                    {trendValue && <span className="ml-1">{trendValue}</span>}
                  </span>
                )}
                {description}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
