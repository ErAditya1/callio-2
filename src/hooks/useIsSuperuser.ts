import { useEffect, useState } from "react";
import { getAuthUserApiV1UserAuthUserGet } from "@/client/sdk.gen";
import { useAuth } from "@/lib/auth";

// Cache superuser status during the browser session to prevent layout shift/flickering
let cachedIsSuperuser: boolean | null = null;
let cachedUserId: number | string | null = null;

export function useIsSuperuser(): {
  isSuperuser: boolean;
  isLoading: boolean;
} {
  const { user, loading: authLoading, getAccessToken } = useAuth();
  const [isSuperuser, setIsSuperuser] = useState<boolean>(cachedIsSuperuser ?? false);
  const [isLoading, setIsLoading] = useState<boolean>(cachedIsSuperuser === null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      cachedIsSuperuser = null;
      cachedUserId = null;
      setIsSuperuser(false);
      setIsLoading(false);
      return;
    }

    // If already cached for current user id, reuse
    const currentUserId = (user as { id?: number | string }).id;
    if (cachedIsSuperuser !== null && cachedUserId && currentUserId && cachedUserId === currentUserId) {
      setIsSuperuser(cachedIsSuperuser);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const checkSuperuser = async () => {
      try {
        const token = await getAccessToken();
        const response = await getAuthUserApiV1UserAuthUserGet({
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const superuserStatus = Boolean(response.data?.is_superuser);
        cachedIsSuperuser = superuserStatus;
        if (currentUserId) {
          cachedUserId = currentUserId;
        }

        if (isMounted) {
          setIsSuperuser(superuserStatus);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to verify superuser permissions:", err);
        cachedIsSuperuser = false;
        if (isMounted) {
          setIsSuperuser(false);
          setIsLoading(false);
        }
      }
    };

    checkSuperuser();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, getAccessToken]);

  return { isSuperuser, isLoading };
}
