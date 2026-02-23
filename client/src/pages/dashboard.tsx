import { motion } from "framer-motion";
import { Link } from "wouter";
import { HeartPulse, ArrowLeft, TrendingUp, ShieldCheck, Users, Brain, Heart, Target, Info } from "lucide-react";
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const pillarData = [
    { pillar: "Empathy", value: 85, full: 100 },
    { pillar: "Safety", value: 72, full: 100 },
    { pillar: "Honesty", value: 65, full: 100 },
    { pillar: "Purpose", value: 90, full: 100 },
    { pillar: "Vulnerability", value: 58, full: 100 },
    { pillar: "Care", value: 82, full: 100 },
];

const trendData = [
    { day: "Day 1", safety: 45, empathy: 50 },
    { day: "Day 7", safety: 52, empathy: 55 },
    { day: "Day 14", safety: 61, empathy: 68 },
    { day: "Day 21", safety: 68, empathy: 75 },
    { day: "Day 30", safety: 78, empathy: 84 },
];

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

            <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                        <HeartPulse className="w-5 h-5" />
                    </div>
                    <span className="font-serif font-semibold text-xl tracking-tight text-foreground">EmpathyOS</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-block text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10">Organization Intelligence</span>
                    <Link href="/chat" className="text-sm font-bold text-foreground hover:underline">Launch Coach</Link>
                    <button
                        onClick={() => {
                            localStorage.removeItem("empathy_os_auth");
                            window.location.href = "/";
                        }}
                        className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-32">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>

                <header className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-3">Culture Dashboard</h1>
                    <p className="text-muted-foreground text-base md:text-lg">Measuring Love as a Strategy across your organization.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Summary Cards */}
                    <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { label: "Empathy Pulse", value: "84%", trend: "+12%", icon: <Heart className="w-5 h-5 text-primary" /> },
                            { label: "Psych Safety", value: "72", trend: "+8", icon: <ShieldCheck className="w-5 h-5 text-blue-500" /> },
                            { label: "Trust Index", value: "Good", trend: "Improving", icon: <Users className="w-5 h-5 text-secondary" /> },
                            { label: "Team Velocity", value: "High", trend: "+15%", icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-6 rounded-2xl border border-white/20"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 rounded-lg bg-background shadow-sm border border-border/50">{stat.icon}</div>
                                    <span className="text-xs font-bold text-emerald-500">{stat.trend}</span>
                                </div>
                                <h3 className="text-sm text-muted-foreground font-medium">{stat.label}</h3>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Radar Chart: 6 Pillars */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 glass-card p-8 rounded-3xl space-y-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-serif font-semibold">6 Pillars of Love</h3>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={pillarData}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 10, fontWeight: 500 }} />
                                    <Radar
                                        name="Organizational Score"
                                        dataKey="value"
                                        stroke="#e94560"
                                        fill="#e94560"
                                        fillOpacity={0.4}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-4">
                            Your team is exceptionally strong in <strong>Shared Purpose</strong>, but there is an opportunity to improve <strong>Vulnerability</strong> to build deeper trust.
                        </p>
                    </motion.div>

                    {/* Line Chart: Sentiment Trends */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 glass-card p-8 rounded-3xl space-y-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-serif font-semibold">Psychological Safety Trend</h3>
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Safety</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Empathy</div>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="safety"
                                        stroke="#e94560"
                                        strokeWidth={4}
                                        dot={{ r: 4, fill: "#e94560", strokeWidth: 2, stroke: "#fff" }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="empathy"
                                        stroke="#3b82f6"
                                        strokeWidth={4}
                                        dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                                <Heart className="absolute -bottom-2 -right-2 w-12 h-12 text-primary opacity-5 animate-pulse" />
                                <div className="flex items-center gap-2 mb-2 relative z-10">
                                    <Brain className="w-4 h-4 text-primary" />
                                    <h4 className="text-sm font-bold">Manager Insight</h4>
                                </div>
                                <p className="text-xs text-muted-foreground relative z-10">The 30-day upward trend correlates with the rollout of EmpathyOS micro-coaching sessions after project retrospectives.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10 relative overflow-hidden">
                                <Heart className="absolute -bottom-2 -right-2 w-12 h-12 text-secondary opacity-5 animate-pulse" />
                                <div className="flex items-center gap-2 mb-2 relative z-10">
                                    <Target className="w-4 h-4 text-secondary" />
                                    <h4 className="text-sm font-bold">Action Item</h4>
                                </div>
                                <p className="text-xs text-muted-foreground relative z-10">Consider a group training on 'Courageous Honesty' as it remains the lowest scoring pillar.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
