"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import {
  Leaf, BarChart3, Sparkles, Trophy, Users, Shield, ArrowRight,
  Globe, CheckCircle2, Calculator, Brain, Target, TrendingDown,
  ChevronRight, Star, Activity, Heart, Zap,
} from "lucide-react";

// ─── Animated Counter ──────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, started]);

  return (
    <span ref={ref} className="font-data">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Features Data ─────────────────────────────────────────────────────────

const features = [
  {
    icon: Calculator, title: "Smart Carbon Calculator",
    description: "Track emissions across 6 categories with 40+ subcategories. Real-time CO₂ calculations with environmental equivalents.",
    gradient: "from-emerald-500 to-teal-500", glow: "glow-emerald",
  },
  {
    icon: Brain, title: "AI Sustainability Engine",
    description: "Personalized eco tips, habit detection, and weekly reports — all powered by intelligent analysis. No API key needed.",
    gradient: "from-violet-500 to-purple-500", glow: "glow-violet",
  },
  {
    icon: Trophy, title: "Gamification System",
    description: "Earn XP, unlock badges, maintain streaks, and climb leaderboards. Turn sustainability into a rewarding daily habit.",
    gradient: "from-amber-500 to-orange-500", glow: "glow-amber",
  },
  {
    icon: BarChart3, title: "Beautiful Analytics",
    description: "Visualize your impact with trend charts, category breakdowns, and goal dashboards. Data-driven sustainability.",
    gradient: "from-blue-500 to-cyan-500", glow: "glow-blue",
  },
  {
    icon: Users, title: "Community & Social",
    description: "Share progress, join eco challenges, compare reductions, and inspire others in a supportive community.",
    gradient: "from-pink-500 to-rose-500", glow: "",
  },
  {
    icon: Shield, title: "Production Security",
    description: "JWT authentication, Zod validation, CSRF protection, and security headers. Enterprise-grade from day one.",
    gradient: "from-slate-400 to-zinc-500", glow: "",
  },
];

const stats = [
  { value: 15420, suffix: "+", label: "kg CO₂ Tracked", icon: Globe },
  { value: 2840, suffix: "+", label: "Activities Logged", icon: Activity },
  { value: 890, suffix: "+", label: "Users Joined", icon: Users },
  { value: 156, suffix: "", label: "Challenges Done", icon: Trophy },
];

const steps = [
  { step: "01", title: "Create Account", description: "Sign up in seconds. No credit card. Start tracking immediately.", icon: Users, color: "from-emerald-500 to-teal-500" },
  { step: "02", title: "Track Activities", description: "Log daily travel, food, energy, and shopping with real-time CO₂ calculations.", icon: Calculator, color: "from-blue-500 to-cyan-500" },
  { step: "03", title: "Get AI Insights", description: "Receive personalized tips and weekly sustainability reports from our AI engine.", icon: Brain, color: "from-violet-500 to-purple-500" },
  { step: "04", title: "Make Impact", description: "Join challenges, earn badges, and watch your carbon footprint shrink over time.", icon: TrendingDown, color: "from-amber-500 to-orange-500" },
];

const testimonials = [
  { name: "Priya S.", role: "Student", text: "CarbonWise made me realize my food choices were my biggest emission source. I've reduced 30% in just 2 months!", avatar: "PS" },
  { name: "Alex C.", role: "Software Engineer", text: "The gamification is addictive. I'm on a 45-day streak and competing with friends on the leaderboard.", avatar: "AC" },
  { name: "Maria G.", role: "Teacher", text: "Finally a sustainability app that doesn't need API keys or subscriptions. Clean, fast, and beautiful.", avatar: "MG" },
];

// ─── Main Component ────────────────────────────────────────────────────────

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04]" style={{ background: "rgba(10,10,15,0.8)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-heading text-lg font-bold text-gradient">CarbonWise</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-32 pb-24 px-4 sm:px-6">
        {/* Dot grid background */}
        <div className="absolute inset-0 dot-grid" aria-hidden="true" />

        {/* Aurora glow orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.07] rounded-full blur-[120px]" style={{ animation: "aurora 8s ease-in-out infinite" }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/[0.05] rounded-full blur-[100px]" style={{ animation: "aurora 10s ease-in-out infinite 2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[140px]" />
        </div>

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Sustainability Platform
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading leading-[1.1] mb-6 tracking-tight">
              Track Your{" "}
              <span className="text-gradient">Carbon</span>
              <br />
              <span className="text-gradient">Footprint.</span>
              {" "}Save the Planet.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Understand your environmental impact, get AI-powered insights, and join a community of eco-conscious people making a real difference.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
              >
                Start Free Today
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium border border-white/10 text-zinc-300 hover:bg-white/[0.04] hover:border-white/15 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                Try Demo Account
              </Link>
            </div>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="card-glass p-5 text-center hover-glow group cursor-default">
                <stat.icon className="w-5 h-5 mx-auto mb-3 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                <p className="text-2xl sm:text-3xl font-bold">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Section ───────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 dot-grid-lg opacity-50" aria-hidden="true" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-zinc-400 mb-4">
              <Target className="w-3 h-3" /> Core Features
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
              Everything to Go{" "}<span className="text-gradient">Green</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              A complete platform for tracking, reducing, and gamifying your sustainability journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "card-base p-6 hover:scale-[1.02] hover:-translate-y-1 group hover-glow cursor-default",
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center mb-5",
                    feature.gradient,
                    "shadow-lg group-hover:shadow-xl transition-shadow",
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold font-heading mb-2 text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 relative">
        {/* Horizontal glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-zinc-400 mb-4">
              <ChevronRight className="w-3 h-3" /> Getting Started
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-base p-6 flex gap-5 hover-glow group cursor-default"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shrink-0",
                    step.color,
                    "shadow-lg",
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-500 font-data tracking-widest">
                      STEP {step.step}
                    </span>
                    <h3 className="text-base font-semibold font-heading mt-1 text-zinc-100">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 dot-grid opacity-30" aria-hidden="true" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-zinc-400 mb-4">
              <Star className="w-3 h-3" /> Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">
              Loved by <span className="text-gradient">Eco Warriors</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-base p-6 hover-glow cursor-default"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact Banner ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.04] to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/[0.05] rounded-full blur-[120px]" aria-hidden="true" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-5 tracking-tight">
              Every Action <span className="text-gradient">Counts</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
              The average person can reduce their carbon footprint by 30-50% through informed daily choices. CarbonWise makes those choices visible.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {[
                { icon: TrendingDown, text: "Save 2+ tonnes CO₂/year" },
                { icon: Heart, text: "Join 890+ eco advocates" },
                { icon: CheckCircle2, text: "6 emission categories" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-zinc-400">
                  <item.icon className="w-4 h-4 text-emerald-400" />
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-5 tracking-tight">
              Ready to Make a{" "}
              <span className="text-gradient">Difference</span>?
            </h2>
            <p className="text-zinc-500 mb-10">
              Join CarbonWise today. It&apos;s free, beautiful, and impactful.
            </p>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
            >
              <Leaf className="w-4 h-4" />
              Get Started — It&apos;s Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-gradient">CarbonWise</span>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} CarbonWise. Built with <Heart className="w-3 h-3 inline text-emerald-500 fill-emerald-500" /> for the planet.
          </p>
          <div className="flex gap-6 text-xs text-zinc-600">
            <Link href="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-emerald-400 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
