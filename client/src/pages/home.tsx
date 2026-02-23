import { useState, useEffect } from "react";
import { Link } from "wouter";
import { HeartPulse, ArrowRight, Sparkles, MessageCircleHeart, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const heroImages = [
  "/images/empathy_vibe.png",
  "/images/image2.png",
  "/images/image3.png",
  "/images/image4.png"
];

const reframes = [
  { from: "I'm frustrated", to: "I'm feeling unsupported in this project" },
  { from: "You're late", to: "I value your contribution and want to ensure we stay on track" },
  { from: "This is wrong", to: "I have a different perspective on how we might approach this" },
  { from: "You don't listen", to: "I'd love to feel more heard during our syncs" },
  { from: "Fix this now", to: "Could we prioritize resolving this together today?" },
  { from: "I'm frustrated", to: "I'm feeling unsupported in this project" }, // Duplicate for seamless scroll
  { from: "You're late", to: "I value your contribution and want to ensure we stay on track" },
];

const pillars = [
  "Empathy & Understanding",
  "Respect & Safety",
  "Courageous Honesty",
  "Shared Purpose",
  "Vulnerability",
  "Accountability with Care"
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <HeartPulse className="w-6 h-6" />
          </div>
          <span className="font-serif font-semibold text-xl tracking-tight text-foreground">EmpathyOS</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/methodology" className="hover:text-foreground transition-colors">Methodology</Link>
          <Link href="/manifesto" className="hover:text-foreground transition-colors">Manifesto</Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Org Intelligence</Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 pt-16 pb-32 landing-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm border border-border/50 text-sm font-medium text-foreground hover-lift cursor-default"
            >
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>Love as a Strategy Framework</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-serif font-semibold text-foreground leading-[1.1] text-balance"
            >
              Have the conversation that <span className="text-primary italic">matters.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl text-balance leading-relaxed"
            >
              EmpathyOS coaches you to speak with love, courage, and clarity — before, during, and after the moments that count in your workplace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full"
            >
              <Link
                href="/chat"
                className="w-full sm:w-auto px-8 py-5 rounded-2xl font-bold text-xl text-primary-foreground bg-primary btn-primary-glow hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                data-testid="button-start-conversation"
              >
                Start Now
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link
                href="/chat?demo=true"
                className="w-full sm:w-auto px-8 py-5 rounded-2xl font-bold text-xl text-foreground bg-card border-2 border-border shadow-lg hover:border-primary/40 hover:bg-accent/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center"
                data-testid="button-try-demo"
              >
                Try Demo
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              {pillars.slice(0, 3).map((p, i) => (
                <span key={i} className="pillar-tag !m-0">{p}</span>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full rounded-[40px] overflow-hidden border border-white/40 shadow-2xl aspect-[4/5] lg:aspect-square glass-card flex items-center justify-center p-4 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

            <div className="relative z-10 w-full h-full rounded-[32px] overflow-hidden bg-white/40 backdrop-blur-sm border border-white/60 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                <HeartPulse className="w-48 h-48 text-primary animate-pulse" />
              </div>
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroImages[currentImage]}
                  src={heroImages[currentImage]}
                  alt="EmpathyOS Team"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-full h-full object-cover relative z-20"
                />
              </AnimatePresence>

              {/* Floating UI Badges */}
              <div className="absolute top-8 left-8 p-3 rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-white/50 z-30 -rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Human Powered</span>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 p-3 rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-white/50 z-30 rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">AI Coaching</span>
                </div>
              </div>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {heroImages.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentImage ? 'bg-primary w-4' : 'bg-primary/20'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pillars-scroller mt-20"
        >
          {pillars.map((p, i) => (
            <span key={i} className="pillar-tag">{p}</span>
          ))}
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left"
        >
          <div className="feature-card p-8 rounded-3xl">
            <div className="icon-box bg-secondary/10 text-secondary">
              <MessageCircleHeart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3">Clarify Intent</h3>
            <p className="text-muted-foreground leading-relaxed">Untangle your emotions and find the compassionate core of your message before you speak.</p>
          </div>

          <div className="feature-card p-8 rounded-3xl">
            <div className="icon-box bg-primary/10 text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3">Anticipate Reactions</h3>
            <p className="text-muted-foreground leading-relaxed">Prepare for defensiveness or fear by mapping out empathetic, constructive responses.</p>
          </div>

          <div className="feature-card p-8 rounded-3xl">
            <div className="icon-box bg-blue-500/10 text-blue-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3">Reflect & Grow</h3>
            <p className="text-muted-foreground leading-relaxed">Turn tough conversations into micro-habits that build your emotional intelligence over time.</p>
          </div>
        </motion.div>
      </main>

      <footer className="mt-auto relative z-10 w-full">
        <div className="empathy-feed">
          <div className="ticker-track">
            {reframes.map((r, i) => (
              <div key={i} className="ticker-item">
                <span className="reframe-from">"{r.from}"</span>
                <span className="reframe-arrow">→</span>
                <span className="reframe-to">"{r.to}"</span>
              </div>
            ))}
            {/* Repeat for seamless loop */}
            {reframes.map((r, i) => (
              <div key={`dup-${i}`} className="ticker-item">
                <span className="reframe-from">"{r.from}"</span>
                <span className="reframe-arrow">→</span>
                <span className="reframe-to">"{r.to}"</span>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
