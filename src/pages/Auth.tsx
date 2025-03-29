import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Github, ShieldCheck, Store, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/lib/types';

const RoleCard = ({ 
  role, 
  title, 
  description, 
  icon: Icon, 
  onClick 
}: { 
  role: Role, 
  title: string, 
  description: string, 
  icon: React.ElementType, 
  onClick: () => void 
}) => (
  <Card className="w-full cursor-pointer transition-all hover:shadow-md" onClick={onClick}>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  </Card>
);

const Auth = () => {
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleSignIn = async () => {
    if (selectedRole) {
      await signIn(selectedRole);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-background to-secondary/50">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">ChainFlux</h1>
          <p className="text-muted-foreground mt-2">Supply Chain Management Platform</p>
        </div>
        
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle>Sign In with GitHub</CardTitle>
            <CardDescription>
              Choose your role to continue to the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="role-selection" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="role-selection">Role Selection</TabsTrigger>
                <TabsTrigger value="github-auth" disabled={!selectedRole}>
                  GitHub Auth
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="role-selection" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <RoleCard
                    role="admin"
                    title="Admin"
                    description="Full access to all features"
                    icon={ShieldCheck}
                    onClick={() => handleRoleSelect('admin')}
                  />
                  <RoleCard
                    role="supplier"
                    title="Supplier"
                    description="Manage your products"
                    icon={User}
                    onClick={() => handleRoleSelect('supplier')}
                  />
                  <RoleCard
                    role="distributor"
                    title="Distributor"
                    description="Track and manage shipments"
                    icon={Truck}
                    onClick={() => handleRoleSelect('distributor')}
                  />
                  <RoleCard
                    role="retailer"
                    title="Retailer"
                    description="Manage store inventory"
                    icon={Store}
                    onClick={() => handleRoleSelect('retailer')}
                  />
                </div>
                {selectedRole && (
                  <div className="pt-4">
                    <p className="text-sm text-center">
                      Selected role: <span className="font-medium capitalize">{selectedRole}</span>
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="github-auth" className="mt-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center mb-2">
                    <p className="text-sm text-muted-foreground">
                      You will sign in as a <span className="font-medium capitalize">{selectedRole}</span>
                    </p>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleSignIn} 
                    disabled={isLoading || !selectedRole}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    {isLoading ? "Signing in..." : "Sign in with GitHub"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 items-start">
            <p className="text-xs text-muted-foreground">
              This is a demo application. In a real application, you would be redirected to GitHub for authentication.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
