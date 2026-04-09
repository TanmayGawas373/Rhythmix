import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loading: boolean;
   login: (token: string, user: any) => void;   // ✅ add this
  logout: () => void;   
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }

    setLoading(false);
  }, []);

  //  LOGIN FUNCTION
  const login = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);

    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  //  LOGOUT FUNCTION
  const logout = () => {
    setAccessToken(null);
    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        loading,
        login,     
        logout,  
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};