import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { HeartPulse, ShieldCheck, ArrowRight, Lock, Heart } from "lucide-react";

export default function AuthPage() {
    const [, setLocation] = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // Simulate Google Login Redirect/Process
        setTimeout(() => {
            localStorage.setItem("empathy_os_auth", "true");
            setLocation("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background gradients for premium feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="bg-primary/10 p-4 rounded-3xl shadow-lg shadow-primary/5 mb-6 relative group">
                        <HeartPulse className="w-12 h-12 text-primary relative z-10" />
                        <Heart className="absolute -top-2 -right-2 w-6 h-6 text-rose-400 fill-rose-400/20 animate-pulse group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">Secure Organization Access</h1>
                    <p className="text-muted-foreground">Sign in to view Empathy Metrics & Org Intelligence</p>
                </div>

                <div className="glass-card p-10 rounded-[32px] border border-white/40 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />

                    <div className="space-y-6">
                        <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-start gap-4 mb-6">
                            <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                This dashboard contains sensitive organizational data. Access is restricted to authorized company administrators and culture leaders.
                            </p>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] disabled:opacity-70 shadow-sm"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#fdfbf7] md:bg-white px-2 text-slate-400 font-bold tracking-widest">or</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="Organization Email"
                                    disabled
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed text-sm font-medium"
                                />
                            </div>
                            <button disabled className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed">
                                Continue with SSO
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <span>By continuing, you agree to our Terms of Service</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>Privacy Policy</span>
                </p>
            </motion.div>
        </div>
    );
}
