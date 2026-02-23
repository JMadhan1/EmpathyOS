import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Helper for safe parsing and logging
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw new Error(`Invalid response format from ${label}`);
  }
  return result.data;
}

export function useClarify() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.ai.clarify.input>) => {
      const validated = api.ai.clarify.input.parse(data);
      const res = await fetch(api.ai.clarify.path, {
        method: api.ai.clarify.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to clarify thoughts");
      }
      const json = await res.json();
      return parseWithLogging(api.ai.clarify.responses[200], json, "ai.clarify");
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useDraft() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.ai.draft.input>) => {
      const validated = api.ai.draft.input.parse(data);
      const res = await fetch(api.ai.draft.path, {
        method: api.ai.draft.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate draft");
      }
      const json = await res.json();
      return parseWithLogging(api.ai.draft.responses[200], json, "ai.draft");
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useAnticipate() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.ai.anticipate.input>) => {
      const validated = api.ai.anticipate.input.parse(data);
      const res = await fetch(api.ai.anticipate.path, {
        method: api.ai.anticipate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to anticipate reactions");
      }
      const json = await res.json();
      return parseWithLogging(api.ai.anticipate.responses[200], json, "ai.anticipate");
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useReflect() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.ai.reflect.input>) => {
      const validated = api.ai.reflect.input.parse(data);
      const res = await fetch(api.ai.reflect.path, {
        method: api.ai.reflect.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to process reflection");
      }
      const json = await res.json();
      return parseWithLogging(api.ai.reflect.responses[200], json, "ai.reflect");
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
