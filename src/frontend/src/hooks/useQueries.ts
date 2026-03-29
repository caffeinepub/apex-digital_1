import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";
import { useActor } from "./useActor";

export function useSubmitContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: {
      name: string;
      email: string;
      message: string;
    }) => {
      // Try cached actor first, then fall back to creating one directly
      let resolvedActor: backendInterface | null = actor;

      if (!resolvedActor) {
        // Try to get actor from React Query cache
        const cachedEntries = queryClient.getQueriesData<backendInterface>({
          predicate: (q) =>
            Array.isArray(q.queryKey) && q.queryKey[0] === "actor",
        });
        resolvedActor = cachedEntries[0]?.[1] ?? null;
      }

      if (!resolvedActor) {
        // Last resort: create actor directly
        resolvedActor = await createActorWithConfig();
      }

      await resolvedActor.submitContact(name, email, message);
    },
  });
}
