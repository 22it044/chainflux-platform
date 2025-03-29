
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface InventoryItem {
  name: string;
  value: number;
  color: string;
}

interface InventoryStatusChartProps {
  isLoading?: boolean;
}

export function InventoryStatusChart({ isLoading = false }: InventoryStatusChartProps) {
  const [chartData, setChartData] = useState<InventoryItem[]>([]);
  
  useEffect(() => {
    // Mock data - would be replaced with real API call
    const data = [
      { name: "Healthy", value: 62, color: "#10b981" },
      { name: "Low Stock", value: 28, color: "#f59e0b" },
      { name: "Out of Stock", value: 10, color: "#ef4444" },
    ];
    
    // Simulate loading
    const timer = setTimeout(() => {
      setChartData(data);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded-md shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  const lowStockPercentage = chartData.find(item => item.name === "Low Stock")?.value || 0;
  const outOfStockPercentage = chartData.find(item => item.name === "Out of Stock")?.value || 0;
  const needsAttention = lowStockPercentage + outOfStockPercentage;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-medium">Inventory Status</CardTitle>
          {needsAttention > 30 && !isLoading && (
            <div className="flex items-center text-yellow-500">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-xs">Needs attention</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="h-32 w-32 rounded-full bg-muted/60 animate-pulse" />
            <div className="mt-4 h-4 w-32 bg-muted/60 rounded animate-pulse" />
          </div>
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center text-xs">
                  <div 
                    className="h-3 w-3 rounded-full mr-1" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
