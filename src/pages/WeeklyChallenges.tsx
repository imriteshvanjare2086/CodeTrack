import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CalendarRange, RotateCcw, Trophy } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ChallengeCard, Challenge } from "@/components/challenges/ChallengeCard";
import { ChallengeModal } from "@/components/challenges/ChallengeModal";
import { ProgressBar } from "@/components/challenges/ProgressBar";
import challengesData from "@/data/challenges.json";

const STORAGE_KEY = "weekly_challenges_completed";

function loadCompleted(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function saveCompleted(set: Set<number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export default function WeeklyChallenges() {
  const challenges = challengesData as Challenge[];
  const [completed, setCompleted] = useState<Set<number>>(loadCompleted);
  const [activeModal, setActiveModal] = useState<Challenge | null>(null);

  const toggleComplete = useCallback((id: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveCompleted(next);
      return next;
    });
  }, []);

  const markComplete = useCallback((id: number) => {
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveCompleted(next);
      return next;
    });
  }, []);

  const handleStart = (challenge: Challenge) => {
    if (challenge.type === "Coding") {
      window.open(challenge.url, "_blank");
    } else if (challenge.type === "MCQ") {
      setActiveModal(challenge);
    } else if (challenge.type === "Task" && challenge.url && challenge.url !== "#") {
      window.open(challenge.url, "_blank");
    }
  };

  const handleReset = () => {
    setCompleted(new Set());
    localStorage.removeItem(STORAGE_KEY);
  };

  const mcqs = challenges.filter((c) => c.type === "MCQ");
  const coding = challenges.filter((c) => c.type === "Coding");
  const tasks = challenges.filter((c) => c.type === "Task");

  const sections = [
    { label: "📝 MCQ Quizzes", items: mcqs, accent: "bg-violet-50/40 dark:bg-gradient-to-r dark:from-violet-500/10 dark:to-transparent border border-violet-100/60 dark:border-transparent" },
    { label: "💻 Coding Challenges", items: coding, accent: "bg-sky-50/40 dark:bg-gradient-to-r dark:from-sky-500/10 dark:to-transparent border border-sky-100/60 dark:border-transparent" },
    { label: "📌 Tech Tasks", items: tasks, accent: "bg-orange-50/40 dark:bg-gradient-to-r dark:from-orange-500/10 dark:to-transparent border border-orange-100/60 dark:border-transparent" },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          title="Weekly Challenges"
          description="Stay accountable with clear weekly goals and visible progress."
        />

        {/* Hero progress card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6"
        >
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <CalendarRange className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  This Week's Challenges
                </h2>
                <p className="font-mono text-xs text-muted-foreground">
                  Progress resets every Monday
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {completed.size === challenges.length && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-500"
                >
                  <Trophy className="h-4 w-4" />
                  Week Complete!
                </motion.div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-2 rounded-xl font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Week
              </Button>
            </div>
          </div>

          <ProgressBar completed={completed.size} total={challenges.length} />
        </motion.div>

        {/* Challenge sections */}
        {sections.map(({ label, items, accent }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className={`flex items-center gap-3 rounded-2xl ${accent} px-5 py-3`}>
              <h3 className="font-heading text-base font-bold text-foreground">{label}</h3>
              <span className="rounded-full bg-muted/30 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {items.filter((c) => completed.has(c.id)).length}/{items.length} done
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((challenge, i) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isCompleted={completed.has(challenge.id)}
                  onStart={() => handleStart(challenge)}
                  onToggleComplete={() => toggleComplete(challenge.id)}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* MCQ Modal */}
      {activeModal && (
        <ChallengeModal
          challenge={activeModal}
          onClose={() => setActiveModal(null)}
          onComplete={() => markComplete(activeModal.id)}
          isCompleted={completed.has(activeModal.id)}
        />
      )}
    </DashboardLayout>
  );
}
