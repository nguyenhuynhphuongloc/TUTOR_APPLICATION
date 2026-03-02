"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type { User } from "@/payload-types";
import { usePathname, useRouter } from "next/navigation";
import { rest } from "./rest";
import type {
  AuthContext,
  Create,
  ForgotPassword,
  Logout,
  ResetPassword,
} from "./types";

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  api?: "rest" | "gql";
}> = ({ children, api = "rest" }) => {
  const [user, setUser] = useState<User | null>();
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  const create = useCallback<Create>(
    async (args) => {
      if (api === "rest") {
        const user = await rest(`/api/users`, args);
        setUser(user);
        return user;
      }
    },
    [api],
  );
  const logout = useCallback<Logout>(async () => {
    if (api === "rest") {
      await rest(`/api/users/logout`);
      setUser(null);
      return;
    }
  }, [api]);

  // On mount, get user and set
  useEffect(() => {
    const fetchMe = async () => {
      if (api === "rest") {
        const user = await rest(
          `/api/users/me`,
          {},
          {
            method: "GET",
          },
        );
        if (!user) {
          if (!/^\/tests\/[0-9a-fA-F-]{36}$/.test(pathname)) {
            // router.replace("/login");
          }
        }
        setUser(user);
      }
    };

    fetchMe();
  }, [api]);

  const forgotPassword = useCallback<ForgotPassword>(
    async (args) => {
      if (api === "rest") {
        const user = await rest(`/api/users/forgot-password`, args);
        setUser(user);
        return user;
      }
    },
    [api],
  );

  const resetPassword = useCallback<ResetPassword>(
    async (args) => {
      if (api === "rest") {
        const user = await rest(`/api/users/reset-password`, args);
        setUser(user);
        return user;
      }
    },
    [api],
  );

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        logout,
        create,
        resetPassword,
        forgotPassword,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseAuth<T = User> = () => AuthContext; // eslint-disable-line no-unused-vars

export const useAuth: UseAuth = () => useContext(Context);
