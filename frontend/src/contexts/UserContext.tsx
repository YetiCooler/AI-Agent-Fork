'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { UserContextType, User } from "@/lib/interface";
import { useAuth } from "@/components/AuthProvider";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<User | null>(null);
  const { user, isLoading, signOut } = useAuth();

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/user/profile`);
      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
      } else {
        signOut();
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      signOut();
    }
  }

  useEffect(() => {
    if (user && !profile) {
      fetchUserData();
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        profile,
        setProfile,
        isLoading,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};
