import React from "react";
import type { Account } from "appwrite";

type UserAccount = Account;
export interface UserContextType {
  user: UserAccount | null;
  setUser: (user: UserAccount | null) => void;
}

interface UserProviderProps {
  children: React.ReactNode; // Define the type for children prop
}

export const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<UserAccount | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
