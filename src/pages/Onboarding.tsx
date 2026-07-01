import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flame, ChevronRight, ChevronLeft, Check, Target, Link2, Zap } from "lucide-react";
import { api } from "@/lib/apiClient";

const steps = ["Connect Platforms", "Select Goal", "Set Daily Target"];

const platforms = [
  { id: "leetcode", name: "LeetCode", icon: "🟠", color: "border-leetcode/30 bg-leetcode/5" },
  { id: "codeforces", name: "Codeforces", icon: "🔵", color: "border-codeforces/30 bg-codeforces/5" },
  { id: "codechef", name: "CodeChef", icon: "🟢", color: "border-codechef/30 bg-codechef/5" },
];

const goals = [
  { id: "placement", name: "Placement Prep", icon: "🎯", description: "FAANG & product companies" },
  { id: "cp", name: "Competitive Programming", icon: "🏆", description: "Contest ratings & competitions" },
  { id: "dsa", name: "DSA Mastery", icon: "🧠", description: "Deep understanding of data structures" },
  { id: "learning", name: "Learning & Exploring", icon: "📚", description: "General skill improvement" },
];

const dailyTargets = [
  { value: 2, label: "2 problems/day", description: "Casual pace" },
  { value: 3, label: "3 problems/day", description: "Steady growth" },
  { value: 5, label: "5 problems/day", description: "Focused prep" },
  { value: 8, label: "8+ problems/day", description: "Intensive mode" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [dailyTarget, setDailyTarget] = useState(3);
  const [usernames, setUsernames] = useState<Record<string, string>>({});

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const canProceed = step === 0 ? selectedPlatforms.length > 0 : step === 1 ? !!selectedGoal : true;

  const handleFinish = async () => {
    await api.patch("/user/profile", {
      platforms: selectedPlatforms.map((id) => ({ id, username: usernames[id] || "" })),
      goal: selectedGoal,
      dailyTarget,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20 mb-4">
            <Flame className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Welcome to CodeTrack</h1>
          <p className="text-sm text-gray-400 font-mono mt-1">Let's set up your profile</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-muted/40"}`} />
            </div>
          ))}
        </div>

        {/* Step label */}
        <div className="flex items-center gap-2 mb-5">
          {step === 0 && <Link2 className="h-4 w-4 text-primary" />}
          {step === 1 && <Target className="h-4 w-4 text-primary" />}
          {step === 2 && <Zap className="h-4 w-4 text-primary" />}
          <span className="text-sm font-heading font-semibold text-white">{steps[step]}</span>
          <span className="text-[10px] font-mono text-gray-500 ml-auto">{step + 1}/{steps.length}</span>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl p-6"
          >
            {step === 0 && (
              <div className="space-y-3">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`w-full flex items-center gap-3 rounded-xl border p-4 transition-all ${
                      selectedPlatforms.includes(p.id) ? `${p.color} ring-1 ring-primary/20` : "border-white/5 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-sm font-mono font-semibold text-white flex-1 text-left">{p.name}</span>
                    {selectedPlatforms.includes(p.id) && (
                      <>
                        <input
                          type="text"
                          placeholder="Username"
                          value={usernames[p.id] || ""}
                          onChange={(e) => { e.stopPropagation(); setUsernames({ ...usernames, [p.id]: e.target.value }); }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-32 px-2.5 py-1.5 rounded-lg bg-[#050505] border border-white/10 text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/40"
                        />
                        <Check className="h-4 w-4 text-primary" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all text-center ${
                      selectedGoal === g.id ? "border-primary/30 bg-primary/5 ring-1 ring-primary/20" : "border-white/5 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-3xl">{g.icon}</span>
                    <span className="text-xs font-mono font-semibold text-white">{g.name}</span>
                    <span className="text-[10px] font-mono text-gray-400">{g.description}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {dailyTargets.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setDailyTarget(t.value)}
                    className={`w-full flex items-center gap-3 rounded-xl border p-4 transition-all ${
                      dailyTarget === t.value ? "border-primary/30 bg-primary/5 ring-1 ring-primary/20" : "border-white/5 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg font-heading font-bold text-primary">{t.value}</span>
                    <div className="text-left flex-1">
                      <span className="text-xs font-mono font-semibold text-white block">{t.label}</span>
                      <span className="text-[10px] font-mono text-gray-400">{t.description}</span>
                    </div>
                    {dailyTarget === t.value && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-mono text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Back
          </button>

          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Started <Zap className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
