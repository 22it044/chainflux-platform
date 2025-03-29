
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Download,
  Eye, 
  Filter, 
  Package, 
  RefreshCcw, 
  Search, 
  ShoppingCart
} from "lucide-react";
import { getFormattedOrders } from "@/lib/data";

interface FormattedOrder {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const Orders = () => {
  const [orders, setOrders] = useState<FormattedOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<FormattedOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      setIsLoading(true);
      // Wait for a bit to simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = getFormattedOrders();
      setOrders(data);
      setFilteredOrders(data);
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        order => 
          order.id.toLowerCase().includes(query) || 
          order.customer.toLowerCase().includes(query)
      );
      setFilteredOrders(filtered);
    }
  };

  const getStatusBadge = (status: FormattedOrder['status']) => {
    const statusConfig = {
      pending: {
        icon: <ShoppingCart className="h-4 w-4 mr-1" />,
        class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      },
      processing: {
        icon: <Package className="h-4 w-4 mr-1" />,
        class: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      },
      shipped: {
        icon: <Package className="h-4 w-4 mr-1" />,
        class: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      },
      delivered: {
        icon: <Package className="h-4 w-4 mr-1" />,
        class: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      },
      cancelled: {
        icon: <Package className="h-4 w-4 mr-1" />,
        class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      }
    };

    return (
      <Badge
        variant="outline"
        className={`flex items-center gap-1 w-fit ${statusConfig[status].class}`}
      >
        {statusConfig[status].icon}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-20 bg-muted/60 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-muted/60 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted/60 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-muted/60 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-6 w-24 bg-muted/60 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-8 w-8 bg-muted/60 rounded-full animate-pulse" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No orders found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Orders;
