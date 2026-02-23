import { motion } from "framer-motion";
import { Link } from "wouter";
import { HeartPulse, ArrowLeft, ArrowRight, Flame, Sparkles, MessageSquareHeart } from "lucide-react";

export default function Manifesto() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

            <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                        <HeartPulse className="w-5 h-5" />
                    </div>
                    <span className="font-serif font-semibold text-xl tracking-tight text-foreground">EmpathyOS</span>
                </Link>
            </nav>

            <main className="relative z-10 max-w-2xl mx-auto px-6 pt-16 pb-32">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="prose prose-lg dark:prose-invert font-serif"
                >
                    <div className="flex items-center gap-3 text-secondary mb-6">
                        <Flame className="w-10 h-10" />
                        <h1 className="text-4xl md:text-5xl font-semibold text-foreground m-0 tracking-tight">The Manifesto</h1>
                    </div>

                    <div className="space-y-12 text-foreground/90 leading-[1.8] text-xl italic opacity-90">
                        <p>
                            Work is not just about transactions; it is about relationships.
                            And relationships are powered by how we speak to one another in the moments that matter.
                        </p>

                        <p className="not-italic font-sans text-lg border-l-4 border-primary pl-6 py-2 bg-primary/5">
                            We believe that <span className="text-primary font-bold">Love is a Strategy</span>. Not a soft feeling, but a fierce, disciplined way of showing up that values the human as much as the result.
                        </p>

                        <blockquote className="border-none p-0 text-3xl font-serif text-foreground leading-tight py-6">
                            "The most productive teams aren't the ones with the best skills—they're the ones with the most trust."
                        </blockquote>

                        <p>
                            We reject the idea that "it's just business." Business is human behavior.
                            When we act out of fear, we hide, we blame, and we fail.
                            When we act out of love, we solve, we grow, and we lead.
                        </p>

                        <div className="pt-12 space-y-8 not-italic font-sans text-base">
                            <div className="flex gap-4">
                                <Sparkles className="w-6 h-6 text-secondary flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-foreground">No More Placeholders</h3>
                                    <p className="text-muted-foreground">We aren't here to give you generic templates. We're here to help you find your voice in the friction.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <MessageSquareHeart className="w-6 h-6 text-primary flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-foreground">Speak to the Human</h3>
                                    <p className="text-muted-foreground">Every Slack message, every PIP, every hard talk is a choice between building or breaking. We choose building.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 text-center">
                            <Link href="/chat" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold text-xl shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all">
                                Join the Movement <ArrowRight className="w-5 h-5 flex-shrink-0" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
