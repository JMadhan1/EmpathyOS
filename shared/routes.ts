import { z } from 'zod';
import { conversations, insertConversationSchema } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  conversations: {
    create: {
      method: 'POST' as const,
      path: '/api/conversations' as const,
      input: insertConversationSchema,
      responses: {
        201: z.custom<typeof conversations.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/conversations/:id' as const,
      responses: {
        200: z.custom<typeof conversations.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/conversations/:id' as const,
      input: insertConversationSchema.partial(),
      responses: {
        200: z.custom<typeof conversations.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    },
    list: {
      method: 'GET' as const,
      path: '/api/conversations' as const,
      responses: {
        200: z.array(z.custom<typeof conversations.$inferSelect>()),
      }
    }
  },
  ai: {
    clarify: {
      method: 'POST' as const,
      path: '/api/ai/clarify' as const,
      input: z.object({
        scenario: z.string(),
        situation: z.string(),
        goal: z.string(),
        worry: z.string(),
        otherFeeling: z.string()
      }),
      responses: {
        200: z.object({
          reframedIntent: z.string(),
          blindSpot: z.string(),
          emotionalContext: z.string()
        }),
      }
    },
    draft: {
      method: 'POST' as const,
      path: '/api/ai/draft' as const,
      input: z.object({
        draftText: z.string(),
        context: z.object({
          scenario: z.string(),
          situation: z.string(),
          goal: z.string(),
          worry: z.string(),
          otherFeeling: z.string()
        })
      }),
      responses: {
        200: z.object({
          coachedVersion: z.string(),
          coachingNotes: z.array(z.object({ emoji: z.string(), note: z.string() }))
        })
      }
    },
    anticipate: {
      method: 'POST' as const,
      path: '/api/ai/anticipate' as const,
      input: z.object({
        context: z.object({
          scenario: z.string(),
          situation: z.string(),
          goal: z.string(),
          worry: z.string(),
          otherFeeling: z.string()
        }),
        draft: z.string()
      }),
      responses: {
        200: z.object({
          reactions: z.array(z.object({
            type: z.string(),
            emoji: z.string(),
            theyMight: z.string(),
            respondWith: z.string()
          }))
        })
      }
    },
    reflect: {
      method: 'POST' as const,
      path: '/api/ai/reflect' as const,
      input: z.object({
        whatHappened: z.string(),
        surprise: z.string(),
        proud: z.string(),
        different: z.string(),
        context: z.object({
          scenario: z.string(),
          situation: z.string(),
          goal: z.string(),
          worry: z.string(),
          otherFeeling: z.string()
        })
      }),
      responses: {
        200: z.object({
          whatYouDidWithLove: z.string(),
          microHabit: z.string(),
          loveReminder: z.string(),
          teamRitual: z.string()
        })
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
