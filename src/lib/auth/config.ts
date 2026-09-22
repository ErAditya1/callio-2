import "server-only";

import { getServerBackendUrl } from "@/lib/apiClient";

export interface StackConfig {
  projectId: string;
  publishableClientKey?: string;
  apiUrl?: string;
  secretServerKey?: string;
}

interface ResolvedAuthConfig {
  authProvider: string;
  stackConfig: StackConfig | null;
  signupEnabled: boolean;
}


async function resolveAuthConfig(): Promise<ResolvedAuthConfig> {
  const backendUrl = getServerBackendUrl();
  const candidateUrls: string[] = [];
  if (backendUrl.includes("localhost")) {
    candidateUrls.push(backendUrl.replace("localhost", "127.0.0.1") + "/api/v1/health");
    candidateUrls.push(backendUrl + "/api/v1/health");
  } else if (backendUrl.includes("127.0.0.1")) {
    candidateUrls.push(backendUrl + "/api/v1/health");
    candidateUrls.push(backendUrl.replace("127.0.0.1", "localhost") + "/api/v1/health");
  } else {
    candidateUrls.push(backendUrl + "/api/v1/health");
  }

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        // Re-validate every 60 s so a backend restart is picked up quickly.
        // No module-level cache — avoids stale provider surviving forever.
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        const authProvider = (data.auth_provider as string) || "local";
        const stackConfig =
          authProvider === "stack" && data.stack_project_id
            ? {
                projectId: data.stack_project_id as string,
                publishableClientKey: (data.stack_publishable_client_key || "") as string,
                apiUrl: (data.stack_api_url || undefined) as string | undefined,
                secretServerKey: (data.stack_secret_server_key || undefined) as string | undefined,
              }
            : null;
        const signupEnabled = data.signup_enabled !== false;
        return { authProvider, stackConfig, signupEnabled };
      }
    } catch {
      // Try next candidate URL
    }
  }

  return { authProvider: "local", stackConfig: null, signupEnabled: true };
}


/**
 * Returns the active auth provider ('local' or 'stack'). Falls back to 'local'.
 */
export async function getAuthProvider(): Promise<string> {
  return (await resolveAuthConfig()).authProvider;
}

/**
 * Returns the public Stack client config when the active provider is `stack`,
 * otherwise null. Server-only — the browser receives these via /api/config/auth.
 */
export async function getStackConfig(): Promise<StackConfig | null> {
  return (await resolveAuthConfig()).stackConfig;
}

/**
 * Returns true when the backend allows signup (`ENABLE_SIGNUP`, default true).
 * The login page uses this to hide the signup link on locked-down installs.
 */
export async function getSignupEnabled(): Promise<boolean> {
  return (await resolveAuthConfig()).signupEnabled;
}
