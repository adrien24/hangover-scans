import { useUserdataState } from "@/hooks/useUserdataState";

/**
 * Mounts a single subscription to `GET /api/userdata/state` so that every
 * consumer of the userdata cache shares one hydrated copy.
 */
export function UserdataBootstrap() {
  useUserdataState();
  return null;
}
