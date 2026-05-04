import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { FiltersBar } from "@/components/problems/FiltersBar";
import { ProblemCard, Problem } from "@/components/problems/ProblemCard";
import problemsData from "@/data/problems.json";
import { motion, AnimatePresence } from "framer-motion";

export default function Problems() {
  const [searchTerm, setSearchTerm] = useState("");
  const [platform, setPlatform] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const typedProblemsData = problemsData as Problem[];

  const filteredProblems = useMemo(() => {
    return typedProblemsData.filter((prob) => {
      const matchesSearch = prob.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = platform === "all" || prob.platform === platform;
      const matchesDifficulty = difficulty === "all" || prob.difficulty === difficulty;
      return matchesSearch && matchesPlatform && matchesDifficulty;
    });
  }, [searchTerm, platform, difficulty, typedProblemsData]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500">
        <PageHeader 
          title="Problems" 
          description="Level up your skills by solving curated challenges from top coding platforms." 
        />

        <div className="glass rounded-3xl p-6 space-y-6">
          <FiltersBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            platform={platform}
            setPlatform={setPlatform}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />

          <div className="pt-4">
            {filteredProblems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-4"
              >
                <div className="h-16 w-16 rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold text-foreground">No problems found</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                    Try adjusting your filters or search term to find what you're looking for.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProblems.map((prob) => (
                    <ProblemCard key={prob.id} problem={prob} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}