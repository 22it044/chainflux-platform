
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
import { mockProducts } from "@/lib/data";
import { Product } from "@/lib/types";
import { 
  AlertTriangle, 
  CheckCircle, 
  PackagePlus, 
  RefreshCcw, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setIsLoading(true);
      // Wait for a bit to simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.sku.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  };

  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        color: "destructive",
        icon: <AlertTriangle className="h-4 w-4 mr-1" />,
      };
    } else if (quantity < minLevel) {
      return {
        label: "Low Stock",
        color: "warning",
        icon: <AlertTriangle className="h-4 w-4 mr-1" />,
      };
    } else {
      return {
        label: "In Stock",
        color: "success",
        icon: <CheckCircle className="h-4 w-4 mr-1" />,
      };
    }
  };

  // Helper for badge variant
  const getBadgeVariant = (color: string) => {
    switch (color) {
      case "destructive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <PackagePlus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-8 w-40 bg-muted/60 rounded animate-pulse" />
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-32 bg-muted/60 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-20 bg-muted/60 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted/60 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-muted/60 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-muted/60 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-6 w-24 bg-muted/60 rounded animate-pulse" /></TableCell>
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
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stockQuantity, product.minStockLevel);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.stockQuantity}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`flex items-center gap-1 w-fit ${getBadgeVariant(stockStatus.color)}`}
                        >
                          {stockStatus.icon}
                          <span>{stockStatus.label}</span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No products found. Try adjusting your search.
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

export default Inventory;
