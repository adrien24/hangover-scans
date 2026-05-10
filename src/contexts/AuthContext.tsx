import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type { User, LoginPayload, RegisterPayload } from "@/types/auth.types";
import * as authService from "@/services/auth.service";
import { userFromJwt } from "@/lib/jwt";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    // Decode JWT locally for immediate UI — no network roundtrip required.
    const localUser = userFromJwt(storedToken);
    if (localUser) {
      setToken(storedToken);
      setUser(localUser);
      setIsLoading(false);
    }

    // Revalidate in background. If the token is rejected, log out.
    authService
      .getMe(storedToken)
      .then((freshUser) => {
        setToken(storedToken);
        setUser(freshUser);
        localStorage.setItem("auth_user", JSON.stringify(freshUser));
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (!localUser) setIsLoading(false);
      });
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const result = await authService.login(payload);
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("auth_user", JSON.stringify(result.user));
      setToken(result.token);
      setUser(result.user);
      navigate("/");
    },
    [navigate]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const result = await authService.register(payload);
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("auth_user", JSON.stringify(result.user));
      setToken(result.token);
      setUser(result.user);
      navigate("/");
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
