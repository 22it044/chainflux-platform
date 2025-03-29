
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User, Role } from '@/lib/types';
import { mockAuthService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (role: Role) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for stored user on first render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const signIn = useCallback(async (role: Role) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await mockAuthService.signin(role);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${user.name}!`,
        variant: "default",
      });
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      toast({
        title: "Sign in failed",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await mockAuthService.signout();
      setUser(null);
      localStorage.removeItem('user');
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Sign out failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
