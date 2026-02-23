import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const conversations = sqliteTable("conversations", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Step 1: Clarify
  scenario: text("scenario").notNull(),
  situation: text("situation").notNull(),
  goal: text("goal").notNull(),
  worry: text("worry").notNull(),
  otherFeeling: text("other_feeling").notNull(),

  // Step 1 AI Outputs
  reframedIntent: text("reframed_intent"),
  blindSpot: text("blind_spot"),
  emotionalContext: text("emotional_context"),

  // Step 2: Draft
  draftText: text("draft_text"),
  coachedVersion: text("coached_version"),
  coachingNotes: text("coaching_notes", { mode: 'json' }), // array of CoachingNote

  // Step 3: Anticipate
  reactions: text("reactions", { mode: 'json' }), // array of Reaction

  // Step 4: Reflect
  reflectionWhatHappened: text("reflection_what_happened"),
  reflectionSurprise: text("reflection_surprise"),
  reflectionProud: text("reflection_proud"),
  reflectionDifferent: text("reflection_different"),

  // Step 4 AI Outputs
  reflectionWhatYouDidWithLove: text("reflection_what_you_did_with_love"),
  reflectionMicroHabit: text("reflection_micro_habit"),
  reflectionLoveReminder: text("reflection_love_reminder"),
  reflectionTeamRitual: text("reflection_team_ritual"),

  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type CoachingNote = { emoji: string; note: string; };
export type Reaction = { type: string; emoji: string; theyMight: string; respondWith: string; };

export type ClarifyRequest = Pick<InsertConversation, 'scenario' | 'situation' | 'goal' | 'worry' | 'otherFeeling'>;
export type ClarifyResponse = Pick<Conversation, 'reframedIntent' | 'blindSpot' | 'emotionalContext'>;

export type DraftRequest = { draftText: string; context: ClarifyRequest };
export type DraftResponse = { coachedVersion: string; coachingNotes: CoachingNote[] };

export type AnticipateRequest = { context: ClarifyRequest; draft: string };
export type AnticipateResponse = { reactions: Reaction[] };

export type ReflectRequest = {
  whatHappened: string;
  surprise: string;
  proud: string;
  different: string;
  context: ClarifyRequest
};
export type ReflectResponse = {
  whatYouDidWithLove: string;
  microHabit: string;
  loveReminder: string;
  teamRitual: string;
};
