import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the user data
interface User {
  id: string;
  profileImage: string;
}

interface UserContextValue {
  auth: User | null;
  setAuth: (user: User | null) => void;
}

// Create the UserContext with an initial value of undefined
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Props for the UserProvider component
interface UserProviderProps {
  children: ReactNode;
}

// Create the UserProvider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<User | null>(null);


  return (
    <UserContext.Provider value={{ auth,setAuth}}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};