import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { InventoryStatusChart } from "@/components/dashboard/InventoryStatusChart";
import { getDashboardStats, getFormattedOrders } from "@/lib/data";
import { DashboardStats } from "@/lib/types";
import {
  BarChart3,
  Bell,
  Box,
  DollarSign,
  ListChecks,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const formattedOrders = getFormattedOrders();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (user) {
          const data = getDashboardStats(user.role);
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getCardsByRole = () => {
    const commonCards = [
      {
        title: "Total Orders",
        value: stats?.totalOrders || 0,
        icon: <ShoppingCart />,
        description: "All time orders",
      },
      {
        title: "Pending Orders",
        value: stats?.pendingOrders || 0,
        icon: <ListChecks />,
        description: "Awaiting processing",
        trend: "neutral" as const,
      },
    ];

    if (!user) return commonCards;

    switch (user.role) {
      case "admin":
        return [
          ...commonCards,
          {
            title: "Total Revenue",
            value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
            icon: <DollarSign />,
            trend: "up" as const,
            trendValue: "12%",
            description: "Compared to last month",
          },
          {
            title: "Low Stock Items",
            value: stats?.lowStockItems || 0,
            icon: <Package />,
            trend: "down" as const,
            trendValue: "3",
            description: "Items need restocking",
          },
        ];
      case "supplier":
        return [
          ...commonCards,
          {
            title: "Products",
            value: 12, // Mock value
            icon: <Box />,
            description: "Active products",
          },
          {
            title: "Performance",
            value: "93%",
            icon: <BarChart3 />,
            trend: "up" as const,
            trendValue: "5%",
            description: "Overall supplier rating",
          },
        ];
      case "distributor":
        return [
          ...commonCards,
          {
            title: "Active Shipments",
            value: 8, // Mock value
            icon: <Package />,
            description: "In transit",
          },
          {
            title: "Delivery Rate",
            value: "97%",
            icon: <BarChart3 />,
            trend: "up" as const,
            trendValue: "2%",
            description: "On-time deliveries",
          },
        ];
      case "retailer":
        return [
          ...commonCards,
          {
            title: "Low Stock Items",
            value: stats?.lowStockItems || 0,
            icon: <Package />,
            description: "Items need restocking",
          },
          {
            title: "Suppliers",
            value: 5, // Mock value
            icon: <Users />,
            description: "Active suppliers",
          },
        ];
      default:
        return commonCards;
    }
  };

  const cards = getCardsByRole();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <DashboardCard
            key={i}
            title={card.title}
            value={isLoading ? "—" : card.value}
            description={card.description}
            icon={card.icon}
            trend={!isLoading ? card.trend : undefined}
            trendValue={card.trendValue || undefined}
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={formattedOrders} isLoading={isLoading} />
        </div>
        <div>
          <InventoryStatusChart isLoading={isLoading} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">
          {user ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Overview` : "Overview"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted h-64 rounded-lg flex items-center justify-center animate-pulse-soft">
            <span className="text-muted-foreground">
              {user?.role === "admin"
                ? "Analytics Overview"
                : user?.role === "supplier"
                ? "Product Performance"
                : user?.role === "distributor"
                ? "Delivery Metrics"
                : "Purchase Orders"}
            </span>
          </div>
          <div className="bg-muted h-64 rounded-lg flex items-center justify-center animate-pulse-soft">
            <span className="text-muted-foreground">
              {user?.role === "admin"
                ? "System Activity"
                : user?.role === "supplier"
                ? "Upcoming Orders"
                : user?.role === "distributor"
                ? "Route Planning"
                : "Inventory Forecast"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
