import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { HeartPulse, ArrowLeft, ArrowRight, Loader2, CheckCircle2, MessageSquare, Shield, Sparkles, Send, Mail, Users2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TextareaAuto } from "./ui/textarea-auto";
import { useClarify, useDraft, useAnticipate, useReflect } from "@/hooks/use-ai";
import { useSaveConversation } from "@/hooks/use-conversations";
import Confetti from "react-confetti";

// --- Types & State ---
type Step = 1 | 2 | 3 | 4;

interface ConversationState {
  // Step 1
  scenario: string;
  situation: string;
  goal: string;
  worry: string;
  otherFeeling: string;
  clarifyResult?: { reframedIntent: string; blindSpot: string; emotionalContext: string };

  // Step 2
  draftText: string;
  draftResult?: { coachedVersion: string; coachingNotes: { emoji: string; note: string }[] };

  // Step 3
  anticipateResult?: { reactions: { type: string; emoji: string; theyMight: string; respondWith: string }[] };

  // Step 4
  whatHappened: string;
  surprise: string;
  proud: string;
  different: string;
  reflectResult?: { whatYouDidWithLove: string; microHabit: string; loveReminder: string; teamRitual: string };
}

const emptyState: ConversationState = {
  scenario: "", situation: "", goal: "", worry: "", otherFeeling: "",
  draftText: "",
  whatHappened: "", surprise: "", proud: "", different: "",
};

const demoState: ConversationState = {
  scenario: "Giving tough feedback",
  situation: "My direct report, Alex, missed a critical project deadline for the third time this month. This is delaying the entire team's launch.",
  goal: "I want Alex to take accountability for the delay and agree on a concrete plan to prevent this from happening again, while ensuring they feel supported rather than attacked.",
  worry: "Alex will feel picked on and potentially shut down or get defensive, which might hurt our working relationship.",
  otherFeeling: "Alex might be feeling overwhelmed by the workload and perhaps embarrassed about falling behind, leading to avoidance.",
  draftText: "Alex, your performance is dragging the team down. You've missed three deadlines now and it's unacceptable. We need to fix this immediately or there will be consequences.",
  whatHappened: "", surprise: "", proud: "", different: "",
};

const scenarios = [
  "Giving tough feedback",
  "Addressing a conflict",
  "Saying no / setting a boundary",
  "Asking for help or support",
  "Upward feedback to my manager",
  "Custom situation"
];

export function ConversationFlow() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>(1);
  const [state, setState] = useState<ConversationState>(emptyState);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  // URL params check for demo mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "true") {
      setState(demoState);
    }
  }, []);

  // Mutations
  const clarifyMut = useClarify();
  const draftMut = useDraft();
  const anticipateMut = useAnticipate();
  const reflectMut = useReflect();
  const saveMut = useSaveConversation();

  // Handlers
  const handleNextStep = () => {
    if (step < 4) setStep((s) => (s + 1) as Step);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const runClarify = async () => {
    const result = await clarifyMut.mutateAsync({
      scenario: state.scenario, situation: state.situation,
      goal: state.goal, worry: state.worry, otherFeeling: state.otherFeeling
    });
    setState(s => ({ ...s, clarifyResult: result }));
  };

  const runDraft = async () => {
    const result = await draftMut.mutateAsync({
      draftText: state.draftText,
      context: {
        scenario: state.scenario, situation: state.situation,
        goal: state.goal, worry: state.worry, otherFeeling: state.otherFeeling
      }
    });
    setState(s => ({ ...s, draftResult: result }));
  };

  const runAnticipate = async () => {
    const result = await anticipateMut.mutateAsync({
      draft: state.draftResult?.coachedVersion || state.draftText,
      context: {
        scenario: state.scenario, situation: state.situation,
        goal: state.goal, worry: state.worry, otherFeeling: state.otherFeeling
      }
    });
    setState(s => ({ ...s, anticipateResult: result }));
  };

  const runReflect = async () => {
    const result = await reflectMut.mutateAsync({
      whatHappened: state.whatHappened, surprise: state.surprise,
      proud: state.proud, different: state.different,
      context: {
        scenario: state.scenario, situation: state.situation,
        goal: state.goal, worry: state.worry, otherFeeling: state.otherFeeling
      }
    });
    setState(s => ({ ...s, reflectResult: result }));
    setShowConfetti(true);

    // Save to DB
    try {
      await saveMut.mutateAsync({
        scenario: state.scenario,
        situation: state.situation,
        goal: state.goal,
        worry: state.worry,
        otherFeeling: state.otherFeeling,
        reframedIntent: state.clarifyResult?.reframedIntent,
        blindSpot: state.clarifyResult?.blindSpot,
        emotionalContext: state.clarifyResult?.emotionalContext,
        draftText: state.draftText,
        coachedVersion: state.draftResult?.coachedVersion,
        coachingNotes: state.draftResult?.coachingNotes,
        reactions: state.anticipateResult?.reactions,
        reflectionWhatHappened: state.whatHappened,
        reflectionSurprise: state.surprise,
        reflectionProud: state.proud,
        reflectionDifferent: state.different,
        reflectionWhatYouDidWithLove: result.whatYouDidWithLove,
        reflectionMicroHabit: result.microHabit,
        reflectionLoveReminder: result.loveReminder,
        reflectionTeamRitual: result.teamRitual
      });
    } catch (e) {
      console.error("Failed to save conversation:", e);
    }
  };

  const updateState = (key: keyof ConversationState, value: any) => {
    setState(s => ({ ...s, [key]: value }));
  };

  const copyForSlack = () => {
    const text = `💬 *Coached Message*:\n\n${state.draftResult?.coachedVersion}\n\n✨ _Generated by EmpathyOS_ 💛`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied for Slack", description: "Message with emojis copied to clipboard." });
  };

  const copyForEmail = () => {
    const text = `Hi [Name],\n\n${state.draftResult?.coachedVersion}\n\nRegards,\n[Your Name]`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied for Email", description: "Professional email format copied to clipboard." });
  };

  const stepTitles = ["1. Clarify", "2. Draft", "3. Anticipate", "4. Reflect"];

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setLocation("/")}>
          <HeartPulse className="w-5 h-5 text-primary" />
          <span className="font-serif font-semibold text-base md:text-xl">EmpathyOS</span>
        </div>
        <div className="flex items-center gap-2">
          {stepTitles.map((title, i) => (
            <div key={i} className="flex items-center">
              <span className={`text-sm font-medium ${step === i + 1 ? 'text-foreground' : 'text-muted-foreground hidden sm:block'}`}>
                {title}
              </span>
              {i < 3 && <div className={`w-4 h-[2px] mx-3 rounded-full hidden sm:block ${step > i + 1 ? 'bg-primary/50' : 'bg-border'}`} />}
            </div>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {/* STEP 1: CLARIFY */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-serif font-semibold mb-3">Clarify Your Intent</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Before you speak, let's untangle the emotions and find the compassionate core of your message.
                </p>
              </div>

              <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm space-y-8">
                <div>
                  <label className="block text-sm font-semibold mb-3">What kind of conversation is this?</label>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {scenarios.map(sc => (
                      <button
                        key={sc}
                        onClick={() => updateState("scenario", sc)}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border-2 
                          ${state.scenario === sc
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-transparent text-muted-foreground hover:border-primary/30 hover:bg-accent/50'}`}
                      >
                        {sc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">What is the situation? (Facts only)</label>
                    <TextareaAuto
                      placeholder="e.g., My direct report missed a deadline..."
                      value={state.situation}
                      onChange={e => updateState("situation", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">What is your ideal outcome?</label>
                    <TextareaAuto
                      placeholder="e.g., I want them to communicate proactively..."
                      value={state.goal}
                      onChange={e => updateState("goal", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-rose-500">Your biggest worry?</label>
                      <TextareaAuto
                        placeholder="They'll get defensive..."
                        value={state.worry}
                        onChange={e => updateState("worry", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-indigo-500">How might they be feeling?</label>
                      <TextareaAuto
                        placeholder="Overwhelmed, scared..."
                        value={state.otherFeeling}
                        onChange={e => updateState("otherFeeling", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    disabled={!state.situation || !state.goal || clarifyMut.isPending}
                    onClick={runClarify}
                    className="px-6 py-3 rounded-xl font-semibold bg-foreground text-background shadow-lg hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {clarifyMut.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-secondary" />}
                    Get AI Insights
                  </button>
                </div>
              </div>

              {/* Insights Reveal */}
              {state.clarifyResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="glass-card p-8 rounded-3xl space-y-6 bg-gradient-to-br from-card to-accent/20"
                >
                  <h3 className="text-xl font-serif font-semibold border-b border-border pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Coach's Perspective
                    </div>
                    <Heart className="w-5 h-5 text-rose-400 animate-pulse fill-rose-400/20" />
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Reframed Intent</h4>
                      <p className="text-foreground leading-relaxed">{state.clarifyResult.reframedIntent}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-secondary uppercase tracking-wider">Your Blind Spot</h4>
                      <p className="text-foreground leading-relaxed">{state.clarifyResult.blindSpot}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-blue-500 uppercase tracking-wider">Their Reality</h4>
                      <p className="text-foreground leading-relaxed">{state.clarifyResult.emotionalContext}</p>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center sm:justify-end">
                    <button onClick={handleNextStep} className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                      Continue to Draft <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 2: DRAFT */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center mb-10">
                <button onClick={handlePrevStep} className="p-2 hover:bg-accent rounded-full transition-colors mr-4">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-serif font-semibold mb-2">Draft the Message</h1>
                  <p className="text-muted-foreground text-lg">Write down what you *want* to say. Don't filter yourself yet.</p>
                </div>
              </div>

              <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm space-y-6">
                <label className="block text-sm font-semibold mb-2">Your initial draft:</label>
                <TextareaAuto
                  className="min-h-[120px] text-lg"
                  placeholder="You missed another deadline..."
                  value={state.draftText}
                  onChange={e => updateState("draftText", e.target.value)}
                />
                <div className="flex justify-center sm:justify-end">
                  <button
                    disabled={!state.draftText || draftMut.isPending}
                    onClick={runDraft}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-foreground text-background shadow-lg hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {draftMut.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-secondary" />}
                    Coach this Draft
                  </button>
                </div>
              </div>

              {state.draftResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div className="bg-rose-50/50 dark:bg-rose-950/20 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/50">
                      <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-4">Your Original</h4>
                      <p className="text-foreground leading-relaxed">{state.draftText}</p>
                    </div>
                    {/* Coached */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 shadow-md">
                      <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" /> Recommended Approach
                        </div>
                        <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                      </h4>
                      <p className="text-foreground leading-relaxed font-medium">{state.draftResult.coachedVersion}</p>
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={copyForSlack}
                          className="flex-1 py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                        >
                          <Send className="w-3 h-3" /> Copy for Slack
                        </button>
                        <button
                          onClick={copyForEmail}
                          className="flex-1 py-2 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                        >
                          <Mail className="w-3 h-3" /> Copy for Email
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl">
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Why this works better</h4>
                    <div className="space-y-3">
                      {state.draftResult.coachingNotes.map((note, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-xl">{note.emoji}</span>
                          <p className="text-muted-foreground text-sm leading-relaxed pt-1">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={() => {
                        handleNextStep();
                        if (!state.anticipateResult) runAnticipate();
                      }}
                      className="px-8 py-3 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                      Anticipate Reactions <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 3: ANTICIPATE */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center mb-10">
                <button onClick={handlePrevStep} className="p-2 hover:bg-accent rounded-full transition-colors mr-4">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-serif font-semibold mb-2">Anticipate & Prepare</h1>
                  <p className="text-muted-foreground text-lg">People rarely react perfectly. Let's map out how they might respond so you aren't caught off guard.</p>
                </div>
              </div>

              {anticipateMut.isPending && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                  <p>Analyzing psychological dynamics...</p>
                </div>
              )}

              {state.anticipateResult && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {state.anticipateResult.reactions.map((r, i) => {
                      const colors = [
                        "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-100", // Defensive
                        "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-100", // Shut down
                        "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-100" // Receptive
                      ];
                      const color = colors[i % colors.length];
                      return (
                        <div key={i} className={`p-6 rounded-3xl border shadow-sm ${color} flex flex-col`}>
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl bg-white/50 dark:bg-black/20 p-2 rounded-xl">{r.emoji}</span>
                              <h4 className="font-bold uppercase tracking-wider text-xs opacity-80">{r.type}</h4>
                            </div>
                            <Heart className="w-3 h-3 text-rose-400 fill-rose-400/10" />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wider opacity-60 block mb-1">They might say:</span>
                              <p className="font-medium italic">"{r.theyMight}"</p>
                            </div>
                            <div className="pt-4 border-t border-black/10 dark:border-white/10">
                              <span className="text-xs font-semibold uppercase tracking-wider opacity-60 block mb-1">Respond with:</span>
                              <p className="text-sm leading-relaxed opacity-90">{r.respondWith}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="glass-card p-8 rounded-3xl mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-serif font-semibold mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        You are ready.
                      </h3>
                      <p className="text-muted-foreground">You have a clear intent, a compassionate message, and you're prepared for their reaction. Go have the conversation.</p>
                    </div>
                    <button
                      onClick={handleNextStep}
                      className="shrink-0 px-8 py-4 rounded-xl font-bold bg-foreground text-background shadow-xl hover:-translate-y-1 transition-all"
                    >
                      I've Had the Conversation
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 4: REFLECT */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center mb-10">
                <button onClick={handlePrevStep} className="p-2 hover:bg-accent rounded-full transition-colors mr-4">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-serif font-semibold mb-2">Reflect & Grow</h1>
                  <p className="text-muted-foreground text-lg">How did it go? Let's turn this experience into a micro-habit.</p>
                </div>
              </div>

              {!state.reflectResult ? (
                <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">What happened?</label>
                    <TextareaAuto
                      placeholder="e.g., They were defensive at first, but calmed down when I..."
                      value={state.whatHappened}
                      onChange={e => updateState("whatHappened", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">What surprised you?</label>
                    <TextareaAuto
                      value={state.surprise}
                      onChange={e => updateState("surprise", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-emerald-500">What are you proud of?</label>
                      <TextareaAuto
                        value={state.proud}
                        onChange={e => updateState("proud", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-rose-500">What would you do differently?</label>
                      <TextareaAuto
                        value={state.different}
                        onChange={e => updateState("different", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      disabled={!state.whatHappened || reflectMut.isPending || saveMut.isPending}
                      onClick={runReflect}
                      className="px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {(reflectMut.isPending || saveMut.isPending) ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      Complete Reflection
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-8 rounded-3xl space-y-8 bg-gradient-to-br from-card to-secondary/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <HeartPulse className="w-32 h-32 text-primary" />
                  </div>

                  <div className="relative z-10 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">What you did with love</h4>
                        <p className="text-xl font-serif text-foreground leading-relaxed">{state.reflectResult.whatYouDidWithLove}</p>
                      </div>
                      <Heart className="w-8 h-8 text-rose-400 fill-rose-400/20 animate-bounce mt-2" />
                    </div>

                    <div className="bg-white/50 dark:bg-black/20 p-6 rounded-2xl border border-white/20">
                      <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Your New Micro-Habit
                      </h4>
                      <p className="text-foreground font-medium">{state.reflectResult.microHabit}</p>
                    </div>

                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Users2 className="w-4 h-4" /> Culture Repair Suggestion
                      </h4>
                      <p className="text-foreground font-medium">{state.reflectResult.teamRitual}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">A reminder for next time</h4>
                      <p className="text-foreground italic">"{state.reflectResult.loveReminder}"</p>
                    </div>

                    <div className="pt-8 border-t border-border flex justify-center">
                      <button
                        onClick={() => {
                          setState(emptyState);
                          setStep(1);
                          setShowConfetti(false);
                          window.scrollTo(0, 0);
                        }}
                        className="px-6 py-3 rounded-xl font-semibold bg-background border-2 border-border shadow-sm hover:border-primary hover:bg-accent transition-all"
                      >
                        Start a New Conversation
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
