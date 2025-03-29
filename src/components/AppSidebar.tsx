import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3, 
  Box, 
  CircleUserRound, 
  ClipboardList, 
  Home, 
  LogOut, 
  Mail, 
  Settings, 
  ShoppingCart, 
  Truck, 
  Users 
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [openMobile, setOpenMobile] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define different navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Orders", url: "/orders", icon: ShoppingCart },
      { title: "Inventory", url: "/inventory", icon: Box },
    ];

    if (!user) return commonItems;

    switch (user.role) {
      case 'admin':
        return [
          ...commonItems,
          { title: "Suppliers", url: "/suppliers", icon: Users },
          { title: "Analytics", url: "/analytics", icon: BarChart3 },
          { title: "Settings", url: "/settings", icon: Settings },
        ];
      case 'supplier':
        return [
          ...commonItems,
          { title: "My Products", url: "/products", icon: Box },
          { title: "Performance", url: "/performance", icon: BarChart3 },
        ];
      case 'distributor':
        return [
          ...commonItems,
          { title: "Shipments", url: "/shipments", icon: Truck },
          { title: "Tracking", url: "/tracking", icon: ClipboardList },
        ];
      case 'retailer':
        return [
          ...commonItems,
          { title: "Purchase Orders", url: "/purchase-orders", icon: ClipboardList },
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center">
          <Box className="h-6 w-6 text-sidebar-primary" />
          <h1 className="ml-2 text-lg font-bold">ChainFlux</h1>
        </div>
        <SidebarTrigger className="lg:hidden" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={isActive(item.url) ? "bg-sidebar-accent" : ""}>
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/messages" className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/profile" className="flex items-center">
                    <CircleUserRound className="h-5 w-5 mr-2" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        {user ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
            <Button variant="outline" size="sm" onClick={() => signOut()} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
            <ThemeToggle />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
