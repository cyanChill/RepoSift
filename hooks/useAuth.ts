import { useSession } from "next-auth/react";

import type { UserWithLinkedAccounts } from "@/db/schema/next-auth";

type useAuthReturn =
  | { isLoading: true; isAuth: false }
  | { isLoading: false; isAuth: false }
  | {
      isLoading: false;
      isAuth: true;
      user: UserWithLinkedAccounts;
      isAdmin: boolean;
      isBanned: boolean;
    };

export default function useAuth(): useAuthReturn {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return { isLoading: true, isAuth: false };
  } else if (status === "unauthenticated" || !session) {
    return { isLoading: false, isAuth: false };
  }

  return {
    isLoading: false,
    isAuth: true,
    user: session.user,
    isAdmin: ["admin", "owner"].includes(session.user.role),
    isBanned: session.user.role === "banned",
  };
}
