import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("kanon-admin-token");
  });

  // Validate stored token on mount — sessions are transient and cleared on canister upgrade
  useEffect(() => {
    if (!token) return;
    import("../actor").then(({ backend }) => {
      backend.checkSession(token).then((valid: boolean) => {
        if (!valid) {
          setToken(null);
          localStorage.removeItem("kanon-admin-token");
        }
      }).catch(() => {
        setToken(null);
        localStorage.removeItem("kanon-admin-token");
      });
    });
  }, [token]);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    localStorage.setItem("kanon-admin-token", newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("kanon-admin-token");
  }, []);

  const isAuthenticated = token !== null;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
