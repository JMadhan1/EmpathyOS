import { motion } from "framer-motion";
import { Link } from "wouter";
import { HeartPulse, ArrowLeft, BookOpen, Target, Users, Shield } from "lucide-react";

export default function Methodology() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

            <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                        <HeartPulse className="w-5 h-5" />
                    </div>
                    <span className="font-serif font-semibold text-xl tracking-tight text-foreground">EmpathyOS</span>
                </Link>
                <Link href="/chat" className="text-sm font-bold text-primary hover:underline">
                    Launch App
                </Link>
            </nav>

            <main className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-32">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6"> Our Methodology </h1>
                    <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                        EmpathyOS is built on the "Love as a Strategy" framework, designed to transform how we communicate in high-stakes workplace environments.
                    </p>

                    <div className="grid gap-12">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <BookOpen className="w-6 h-6" />
                                <h2 className="text-2xl font-serif font-semibold">The Core Pillars</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { title: "Empathy & Understanding", desc: "Walking in another's shoes to grasp their perspective before responding.", icon: <Users className="w-5 h-5" /> },
                                    { title: "Courageous Honesty", desc: "Being direct and clear without being aggressive or dismissive.", icon: <Shield className="w-5 h-5" /> },
                                    { title: "Shared Purpose", desc: "Aligning on common goals to move from conflict to collaboration.", icon: <Target className="w-5 h-5" /> },
                                    { title: "Vulnerability", desc: "Opening up about your own worries to build authentic trust.", icon: <HeartPulse className="w-5 h-5" /> },
                                ].map((pillar, i) => (
                                    <div key={i} className="glass-card p-6 rounded-2xl border-l-[3px] border-primary/40">
                                        <div className="text-primary mb-3">{pillar.icon}</div>
                                        <h3 className="font-bold mb-2">{pillar.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4 glass-card p-8 rounded-3xl bg-gradient-to-br from-card to-secondary/5">
                            <h2 className="text-2xl font-serif font-semibold mb-4">The 4-Step Loop</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Clarify Intent</h4>
                                        <p className="text-muted-foreground text-sm">Separating the "noise" of frustration from the objective goal you actually want to achieve.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Draft & Refine</h4>
                                        <p className="text-muted-foreground text-sm">Turning defensive or aggressive language into compassionate, constructive requests.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Anticipate Dynamics</h4>
                                        <p className="text-muted-foreground text-sm">Preparing for pushback so you can stay in a "Love" headspace instead of reacting with "Fear".</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Reflect & Encode</h4>
                                        <p className="text-muted-foreground text-sm">Closing the loop by analyzing what worked to build lasting emotional intelligence.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
