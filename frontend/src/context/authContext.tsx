import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

type AuthContextType = {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.user); 
      } catch {
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
