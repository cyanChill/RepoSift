import { useSession } from "next-auth/react";

type useAuthReturn = {
  isLoading: boolean;
  isAuth: boolean;
  isAdmin: boolean;
  isBanned: boolean;
};

export default function useAuth(): useAuthReturn {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return { isLoading: true, isAuth: false, isAdmin: false, isBanned: false };
  } else if (status === "unauthenticated") {
    return { isLoading: false, isAuth: false, isAdmin: false, isBanned: false };
  } else {
    // Temporary hard-coding of "isAdmin" & isBanned
    return { isLoading: false, isAuth: true, isAdmin: false, isBanned: false };
  }
}
