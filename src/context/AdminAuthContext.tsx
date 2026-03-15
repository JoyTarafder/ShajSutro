"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

interface AdminAuthContextType {
  token: string | null;
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  apiFetch: <T>(path: string, options?: RequestInit) => Promise<T>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AdminAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    const storedAdmin = localStorage.getItem("admin_user");
    if (stored && storedAdmin) {
      setToken(stored);
      setAdmin(JSON.parse(storedAdmin) as AdminUser);
    }
    setIsLoading(false);
  }, []);

  // Authenticated fetch helper
  const apiFetch = useCallback(
    async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
      const storedToken = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
          ...(options.headers ?? {}),
        },
      });

      if (res.status === 401) {
        // Token expired — clear and redirect
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setToken(null);
        setAdmin(null);
        router.push("/admin/login");
        throw new Error("Session expired. Please log in again.");
      }

      const data = (await res.json()) as { success: boolean; message?: string } & T;
      if (!res.ok) {
        throw new Error(
          (data as { message?: string }).message ?? "Request failed"
        );
      }
      return data;
    },
    [router]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as {
        success: boolean;
        message?: string;
        token?: string;
        data?: { id: string; name: string; email: string; role: string };
      };

      if (!res.ok || !data.success) {
        throw new Error(data.message ?? "Login failed");
      }

      if (data.data?.role !== "admin") {
        throw new Error("Access denied — admin accounts only");
      }

      const adminUser: AdminUser = {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: "admin",
      };

      localStorage.setItem("admin_token", data.token!);
      localStorage.setItem("admin_user", JSON.stringify(adminUser));
      setToken(data.token!);
      setAdmin(adminUser);
      router.push("/admin/dashboard");
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setAdmin(null);
    router.push("/admin/login");
  }, [router]);

  return (
    <AdminAuthContext.Provider
      value={{ token, admin, isLoading, login, logout, apiFetch }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAdminAuth = (): AdminAuthContextType => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
};
