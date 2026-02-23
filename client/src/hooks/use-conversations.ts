import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw new Error(`Invalid response format from ${label}`);
  }
  return result.data;
}

export function useSaveConversation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.conversations.create.input>) => {
      const validated = api.conversations.create.input.parse(data);
      const res = await fetch(api.conversations.create.path, {
        method: api.conversations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) throw new Error("Failed to save conversation");
      const json = await res.json();
      return parseWithLogging(api.conversations.create.responses[201], json, "conversations.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.conversations.list.path] });
      toast({
        title: "Conversation Saved",
        description: "Your reflection has been safely stored.",
      });
    },
    onError: (error) => {
      toast({
        title: "Warning",
        description: "Could not save conversation to history, but you can still view your results.",
        variant: "destructive",
      });
    }
  });
}

export function useConversationsList() {
  return useQuery({
    queryKey: [api.conversations.list.path],
    queryFn: async () => {
      const res = await fetch(api.conversations.list.path);
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const json = await res.json();
      return parseWithLogging(api.conversations.list.responses[200], json, "conversations.list");
    }
  });
}
