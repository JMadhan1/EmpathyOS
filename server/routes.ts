import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// NOTE: using Replit AI Integrations OpenAI client
// It will auto-authenticate using Replit's environment credentials
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `You are EmpathyOS, an AI micro-coach for difficult workplace conversations.
You are grounded in the "Love as a Strategy" framework, which treats love as a serious business strategy built on:
- Empathy & Understanding
- Respect & Psychological Safety
- Courageous Honesty
- Shared Purpose & Trust
- Vulnerability & Openness
- Accountability with Care

Your role is to:
1. Help people prepare for difficult conversations with love, courage, and clarity
2. Never replace the human conversation — only augment the human's ability to show up well
3. Always prioritize human dignity, mutual respect, and relationship health
4. Be warm, direct, and practical — not preachy or generic
5. Give specific, actionable coaching — not vague affirmations

Tone: Warm, wise, direct. Like a trusted coach who believes in both love AND accountability.
Format: Always return valid JSON matching the exact schema requested.`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Storage Routes
  app.post(api.conversations.create.path, async (req, res) => {
    try {
      const input = api.conversations.create.input.parse(req.body);
      const conv = await storage.createConversation(input);
      res.status(201).json(conv);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.get(api.conversations.list.path, async (req, res) => {
    const convs = await storage.getConversations();
    res.json(convs);
  });

  app.get(api.conversations.get.path, async (req, res) => {
    const conv = await storage.getConversation(Number(req.params.id));
    if (!conv) return res.status(404).json({ message: 'Conversation not found' });
    res.json(conv);
  });

  app.put(api.conversations.update.path, async (req, res) => {
    try {
      const input = api.conversations.update.input.parse(req.body);
      const conv = await storage.updateConversation(Number(req.params.id), input);
      if (!conv) return res.status(404).json({ message: 'Conversation not found' });
      res.json(conv);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // AI Routes
  app.post(api.ai.clarify.path, async (req, res) => {
    try {
      const { scenario, situation, goal, worry, otherFeeling } = api.ai.clarify.input.parse(req.body);
      
      const prompt = `A user is preparing for a difficult conversation.
Scenario: ${scenario}
Situation: ${situation}
Goal: ${goal}
Worry: ${worry}
Other Person's Feeling: ${otherFeeling}

Analyze this situation and provide:
1. "reframedIntent": The user's goal reframed with love and empathy.
2. "blindSpot": One empathy blind spot the user should watch out for.
3. "emotionalContext": A brief note on the other person's likely emotional state.
Respond in JSON format.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message?.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ message: "Failed to generate coaching insight." });
    }
  });

  app.post(api.ai.draft.path, async (req, res) => {
    try {
      const { draftText, context } = api.ai.draft.input.parse(req.body);
      
      const prompt = `Context:
Scenario: ${context.scenario}
Situation: ${context.situation}
Goal: ${context.goal}

User's Draft Message:
"${draftText}"

Provide:
1. "coachedVersion": A rewritten version of the message using the Love as a Strategy framework.
2. "coachingNotes": An array of 2-3 notes explaining the changes. Each note must have an "emoji" and a short "note" string (e.g. "Replaced blame with ownership").
Respond in JSON format.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message?.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ message: "Failed to coach the draft." });
    }
  });

  app.post(api.ai.anticipate.path, async (req, res) => {
    try {
      const { context, draft } = api.ai.anticipate.input.parse(req.body);
      
      const prompt = `Context:
Situation: ${context.situation}
Other Person's Feeling: ${context.otherFeeling}
Message to deliver: "${draft}"

Simulate 3 likely emotional reactions from the other person.
For each reaction, provide:
- "type": The reaction type (e.g., Defensive, Anxious, Relieved)
- "emoji": An appropriate emoji
- "theyMight": What they might say or feel (1-2 sentences)
- "respondWith": A 1-2 sentence coaching tip on how to respond with love.

Return a JSON object with a "reactions" array.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message?.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ message: "Failed to anticipate reactions." });
    }
  });

  app.post(api.ai.reflect.path, async (req, res) => {
    try {
      const { whatHappened, surprise, proud, different, context } = api.ai.reflect.input.parse(req.body);
      
      const prompt = `Context of original situation: ${context.situation}

Reflection Notes:
What happened: ${whatHappened}
What surprised them: ${surprise}
What they are proud of: ${proud}
What they would do differently: ${different}

Provide a reflection insight JSON with:
1. "whatYouDidWithLove": Affirmation of positive behavior.
2. "microHabit": One small, specific behavior change for next time.
3. "loveReminder": One short quote/principle from the Love as a Strategy framework.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message?.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ message: "Failed to generate reflection." });
    }
  });

  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingConvs = await storage.getConversations();
  if (existingConvs.length === 0) {
    await storage.createConversation({
      scenario: "Giving tough feedback",
      situation: "My teammate has been missing deadlines.",
      goal: "I want them to understand the impact.",
      worry: "They'll get defensive.",
      otherFeeling: "Overwhelmed.",
      reframedIntent: "To help them succeed by aligning on clear expectations.",
      blindSpot: "Assuming their missed deadlines are due to laziness rather than unvoiced blockers.",
      emotionalContext: "They are likely stressed and anxious about falling behind.",
      draftText: "You need to stop missing deadlines.",
      coachedVersion: "I've noticed we've missed a few deadlines recently. Can we talk about what's getting in the way?",
      coachingNotes: [
        { emoji: "💛", note: "Shifted from blame to curiosity." },
        { emoji: "🤝", note: "Used 'we' instead of 'you' to show partnership." }
      ],
      reactions: [
        { type: "Defensive", emoji: "🛡️", theyMight: "I have too much on my plate!", respondWith: "Acknowledge their workload and ask how you can help prioritize." }
      ]
    });
  }
}
