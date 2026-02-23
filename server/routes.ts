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

const SYSTEM_PROMPT = `
You are EmpathyOS, an AI micro-coach for difficult workplace conversations.
You are grounded in the Love as a Strategy framework built on:
- Empathy & Understanding
- Respect & Psychological Safety  
- Courageous Honesty
- Shared Purpose & Trust
- Vulnerability & Openness
- Accountability with Care

Rules:
1. Always return valid JSON matching the exact schema requested
2. Be warm, direct, and practical — not preachy or generic
3. Give specific actionable coaching — not vague affirmations
4. Never replace the human conversation — only augment the human's ability to show up well
5. Tone: Like a trusted coach who believes in both love AND accountability
`;

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
      const data = api.ai.clarify.input.parse(req.body);
      
      const prompt = `
The user is preparing for a difficult workplace conversation.

Scenario type: ${data.scenario}
Situation: ${data.situation}
Goal: ${data.goal}
Worry: ${data.worry}
How the other person might be feeling: ${data.otherFeeling}

Return JSON with exactly this schema:
{
  "reframedIntent": "A loving, clear reframe of their goal in 1-2 sentences",
  "blindSpot": "One specific empathy blind spot they might be missing",
  "emotionalContext": "Brief insight into the other person's likely emotional state and what they need"
}`;

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
      
      const prompt = `
The user has written a draft message/talking points for a difficult workplace conversation.

Context:
Scenario: ${context.scenario}
Situation: ${context.situation}
Goal: ${context.goal}

Their draft:
${draftText}

Return JSON with exactly this schema:
{
  "coachedVersion": "A rewritten version of their draft that keeps their core message but adds empathy, removes blame, adds psychological safety, and aligns with Love as a Strategy. Keep it natural and human — not robotic.",
  "coachingNotes": [
    {"emoji": "💛", "note": "Short specific note about what was changed and why"},
    {"emoji": "🛡️", "note": "Short specific note about what was changed and why"},
    {"emoji": "🎯", "note": "Short specific note about what was changed and why"}
  ]
}`;

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
      
      const prompt = `
Based on this workplace conversation context:

Scenario: ${context.scenario}
Situation: ${context.situation}
Coached message: ${draft}

Simulate 3 realistic emotional reactions the other person might have.

Return JSON with exactly this schema:
{
  "reactions": [
    {
      "type": "Defensive",
      "emoji": "😤",
      "theyMight": "What they might say or feel internally in 1-2 sentences",
      "respondWith": "How to respond with love and boundaries in 1-2 sentences"
    },
    {
      "type": "Anxious but Open",
      "emoji": "😟",
      "theyMight": "What they might say or feel internally in 1-2 sentences",
      "respondWith": "How to respond with love and boundaries in 1-2 sentences"
    },
    {
      "type": "Relieved",
      "emoji": "😌",
      "theyMight": "What they might say or feel internally in 1-2 sentences",
      "respondWith": "How to respond with love and boundaries in 1-2 sentences"
    }
  ]
}`;

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
      
      const prompt = `
The user just had a difficult workplace conversation and is reflecting on it.

Original situation: ${context.situation}
What happened: ${whatHappened}
What surprised them: ${surprise}
What they're proud of: ${proud}
What they'd do differently: ${different}

Return JSON with exactly this schema:
{
  "whatYouDidWithLove": "Specific affirmation of 1-2 loving behaviors they demonstrated",
  "microHabit": "One small specific behavior change to practice next time — make it concrete and actionable",
  "loveReminder": "A short powerful principle from Love as a Strategy that applies to their situation"
}`;

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
