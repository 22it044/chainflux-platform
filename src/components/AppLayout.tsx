
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/hooks/useAuth';

export function AppLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="h-16 border-b flex items-center px-6 lg:hidden">
            <SidebarTrigger />
            <div className="ml-4 font-medium">ChainFlux</div>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
