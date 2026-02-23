import { Link } from "wouter";
import { HeartPulse, ArrowRight, Sparkles, MessageCircleHeart, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <HeartPulse className="w-6 h-6" />
          </div>
          <span className="font-serif font-semibold text-xl tracking-tight text-foreground">EmpathyOS</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Methodology</a>
          <a href="#" className="hover:text-foreground transition-colors">Manifesto</a>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm border border-border/50 text-sm font-medium text-foreground mb-8 hover-lift cursor-default"
        >
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>Love as a Strategy Framework</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-serif font-semibold text-foreground leading-[1.1] mb-6 text-balance max-w-4xl mx-auto"
        >
          Have the conversation that <span className="text-primary italic">matters.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-balance leading-relaxed"
        >
          EmpathyOS coaches you to speak with love, courage, and clarity — before, during, and after the moments that count in your workplace.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link 
            href="/chat" 
            className="w-full sm:w-80 px-8 py-5 rounded-2xl font-bold text-xl text-primary-foreground bg-primary shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
            data-testid="button-start-conversation"
          >
            Start a Conversation
            <ArrowRight className="w-6 h-6" />
          </Link>
          <Link 
            href="/chat?demo=true" 
            className="w-full sm:w-80 px-8 py-5 rounded-2xl font-bold text-xl text-foreground bg-card border-2 border-border shadow-lg hover:border-primary/40 hover:bg-accent/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center"
            data-testid="button-try-demo"
          >
            Try Interactive Demo
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left"
        >
          <div className="glass-card p-8 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
              <MessageCircleHeart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3">Clarify Intent</h3>
            <p className="text-muted-foreground leading-relaxed">Untangle your emotions and find the compassionate core of your message before you speak.</p>
          </div>
          
          <div className="glass-card p-8 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3">Anticipate Reactions</h3>
            <p className="text-muted-foreground leading-relaxed">Prepare for defensiveness or fear by mapping out empathetic, constructive responses.</p>
          </div>

          <div className="glass-card p-8 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3">Reflect & Grow</h3>
            <p className="text-muted-foreground leading-relaxed">Turn tough conversations into micro-habits that build your emotional intelligence over time.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
