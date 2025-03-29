
import { User, Role } from './types';

// Mock user data for GitHub auth - this would be replaced with real auth in a production app
const MOCK_USERS: Record<string, User> = {
  "1": {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    imageUrl: "https://avatars.githubusercontent.com/u/1234567",
  },
  "2": {
    id: "2",
    name: "Supplier User",
    email: "supplier@example.com",
    role: "supplier",
    imageUrl: "https://avatars.githubusercontent.com/u/2345678",
  },
  "3": {
    id: "3",
    name: "Distributor User",
    email: "distributor@example.com",
    role: "distributor",
    imageUrl: "https://avatars.githubusercontent.com/u/3456789",
  },
  "4": {
    id: "4",
    name: "Retailer User",
    email: "retailer@example.com",
    role: "retailer",
    imageUrl: "https://avatars.githubusercontent.com/u/4567890",
  },
};

// A fake auth service that would be replaced with real GitHub authentication
export const mockAuthService = {
  signin: async (role: Role): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (role) {
      case 'admin':
        return MOCK_USERS["1"];
      case 'supplier':
        return MOCK_USERS["2"];
      case 'distributor':
        return MOCK_USERS["3"];
      case 'retailer':
        return MOCK_USERS["4"];
      default:
        throw new Error("Invalid role");
    }
  },
  signout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }
};
