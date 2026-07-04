import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Video,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  DSA_SHEETS,
  COURSES,
  ROADMAPS,
  ROADMAP_DOMAINS,
  COURSE_DOMAINS,
} from "@/data/study-hub";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function StudyHub() {
  const [selectedSection, setSelectedSection] = useState<string>("sheets");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);
  const [selectedRoadmapDomain, setSelectedRoadmapDomain] = useState<string>(ROADMAP_DOMAINS[0]);
  const [isRoadmapDropdownOpen, setIsRoadmapDropdownOpen] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set([0]));

  // Filter courses by selected domain
  const filteredCourses = useMemo(() => {
    if (selectedDomain === "All") return COURSES;
    return COURSES.filter(course => course.category === selectedDomain);
  }, [selectedDomain]);

  // Get selected roadmap
  const selectedRoadmap = useMemo(() => {
    return ROADMAPS.find(r => r.domain === selectedRoadmapDomain) ?? ROADMAPS[0];
  }, [selectedRoadmapDomain]);

  const toggleStage = (idx: number) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Helper for difficulty colors
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "advanced":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-primary/10 text-primary border-primary/30";
    }
  };

  const stageAccentColors = [
    "border-emerald-500/40 bg-emerald-500/5",
    "border-blue-500/40 bg-blue-500/5",
    "border-violet-500/40 bg-violet-500/5",
    "border-amber-500/40 bg-amber-500/5",
    "border-rose-500/40 bg-rose-500/5",
  ];

  const stageNumberColors = [
    "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30",
    "bg-blue-500/20 text-blue-400 ring-blue-500/30",
    "bg-violet-500/20 text-violet-400 ring-violet-500/30",
    "bg-amber-500/20 text-amber-400 ring-amber-500/30",
    "bg-rose-500/20 text-rose-400 ring-rose-500/30",
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 py-8 px-4">
        {/* Header */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-foreground flex items-center gap-3">
              <span>📚</span> Study Hub
            </h1>
            <p className="text-muted-foreground text-base">
              Curated learning resources and interactive roadmaps for software engineers.
            </p>
          </div>

          {/* Navigation tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-xl w-fit">
            <button
              onClick={() => setSelectedSection("sheets")}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm font-bold transition-all duration-300",
                selectedSection === "sheets"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-white/5"
              )}
            >
              <BookOpen className="h-4 w-4" />
              DSA Sheets
            </button>
            <button
              onClick={() => setSelectedSection("courses")}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm font-bold transition-all duration-300",
                selectedSection === "courses"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-white/5"
              )}
            >
              <Video className="h-4 w-4" />
              Courses
            </button>
            <button
              onClick={() => setSelectedSection("roadmaps")}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm font-bold transition-all duration-300",
                selectedSection === "roadmaps"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-white/5"
              )}
            >
              <TrendingUp className="h-4 w-4" />
              Roadmaps
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* 📄 DSA Sheets Section */}
          {selectedSection === "sheets" && (
            <motion.div
              key="sheets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-black font-heading text-foreground">DSA Sheets</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DSA_SHEETS.map((sheet) => (
                  <motion.div
                    key={sheet.id}
                    whileHover={{ y: -6 }}
                    className="rounded-3xl p-6 border border-slate-200 dark:border-white/10 bg-card dark:bg-white/5 backdrop-blur-none dark:backdrop-blur-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <Badge variant="outline" className={getDifficultyColor(sheet.difficulty)}>
                          {sheet.difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-black text-foreground mb-1 tracking-tight">{sheet.title}</h3>
                      <p className="text-xs font-mono text-muted-foreground mb-3">By {sheet.author}</p>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{sheet.description}</p>
                    </div>
                    <Button asChild className="w-full h-11 justify-center gap-2 font-bold rounded-xl">
                      <a href={sheet.url} target="_blank" rel="noreferrer">
                        Open Sheet
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 🎥 Courses Section */}
          {selectedSection === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <Video className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-black font-heading text-foreground">Courses</h2>
                </div>
                {/* Domain Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-card dark:bg-white/5 text-sm font-bold text-foreground dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                  >
                    <span>Domain: {selectedDomain}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isDomainDropdownOpen ? "rotate-180" : "")} />
                  </button>
                  {isDomainDropdownOpen && (
                    <div className="absolute top-full right-0 mt-3 bg-card dark:bg-[#111115] border border-slate-300/80 dark:border-white/10 rounded-2xl p-2 z-10 min-w-[220px] max-h-[300px] overflow-y-auto shadow-2xl dark:shadow-black/50">
                      {COURSE_DOMAINS.map((domain) => (
                        <button
                          key={domain}
                          onClick={() => {
                            setSelectedDomain(domain);
                            setIsDomainDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                            selectedDomain === domain
                              ? "bg-primary text-primary-foreground font-bold"
                              : "text-muted-foreground hover:text-foreground dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                          )}
                        >
                          {domain}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Courses Grid */}
              {filteredCourses.length === 0 ? (
                <div className="glass rounded-3xl p-16 text-center border border-slate-200 dark:border-white/10 bg-card dark:bg-white/5">
                  <p className="text-muted-foreground font-mono">No courses found for this domain.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ y: -6 }}
                      className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-card dark:bg-white/5 backdrop-blur-none dark:backdrop-blur-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 w-full overflow-hidden bg-black/40">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop";
                            }}
                          />
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                              {course.difficulty}
                            </Badge>
                            {course.duration && (
                              <Badge variant="outline" className="text-xs font-mono text-muted-foreground border-slate-200 dark:border-white/10">
                                {course.duration}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-black text-foreground line-clamp-2 tracking-tight">{course.title}</h3>
                            <p className="text-xs font-mono text-muted-foreground">Instructor: {course.instructor}</p>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{course.description}</p>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <Button asChild className="w-full h-11 justify-center gap-2 font-bold rounded-xl">
                          <a href={course.playlistUrl} target="_blank" rel="noreferrer">
                            Open Playlist
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* 🛣️ Roadmaps Section */}
          {selectedSection === "roadmaps" && (
            <motion.div
              key="roadmaps"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-black font-heading text-foreground">Roadmaps</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pick a domain and follow the stages in order: learn, practice, build, then revise.
                  </p>
                </div>

                {/* Domain Dropdown for Roadmaps */}
                <div className="relative">
                  <button
                    onClick={() => setIsRoadmapDropdownOpen(!isRoadmapDropdownOpen)}
                    className="flex items-center gap-2.5 pl-4 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-card dark:bg-white/5 text-sm font-bold text-foreground hover:bg-slate-50 dark:hover:bg-white/10 transition-all min-w-[240px] justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-primary/10 px-2 font-mono text-[11px] font-black text-primary">
                        {selectedRoadmap?.icon}
                      </span>
                      <span className="truncate">{selectedRoadmapDomain}</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isRoadmapDropdownOpen ? "rotate-180" : "")} />
                  </button>
                  <AnimatePresence>
                    {isRoadmapDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 bg-card dark:bg-[#111115] border border-slate-300/80 dark:border-white/10 rounded-2xl p-2 z-30 min-w-[260px] max-h-[360px] overflow-y-auto shadow-2xl dark:shadow-black/60"
                      >
                        {ROADMAP_DOMAINS.map((domain) => {
                          const rm = ROADMAPS.find(r => r.domain === domain);
                          return (
                            <button
                              key={domain}
                              onClick={() => {
                                setSelectedRoadmapDomain(domain);
                                setIsRoadmapDropdownOpen(false);
                                setExpandedStages(new Set([0]));
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2.5",
                                selectedRoadmapDomain === domain
                                  ? "bg-primary text-primary-foreground font-bold"
                                  : "text-muted-foreground hover:text-foreground dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                              )}
                            >
                              <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-primary/10 px-1.5 font-mono text-[10px] font-black text-primary">
                                {rm?.icon}
                              </span>
                              <span>{domain}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Selected Roadmap Detail */}
              {selectedRoadmap && (
                <motion.div
                  key={selectedRoadmap.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-card dark:bg-white/[0.03] p-6 flex flex-col md:flex-row md:items-center gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 font-mono text-base font-black text-primary">
                      {selectedRoadmap.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl md:text-3xl font-black font-heading text-foreground tracking-tight mb-2">{selectedRoadmap.title}</h3>
                      <p className="text-muted-foreground text-sm md:text-base leading-7 mb-4 max-w-3xl">{selectedRoadmap.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/20 border border-border/40 rounded-full px-3 py-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {selectedRoadmap.totalDuration}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/20 border border-border/40 rounded-full px-3 py-1.5">
                          {selectedRoadmap.stages.length} Stages
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/20 border border-border/40 rounded-full px-3 py-1.5">
                          {selectedRoadmap.stages.reduce((s, st) => s + st.items.length, 0)} Topics
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stages accordion */}
                  <div className="space-y-4">
                    {selectedRoadmap.stages.map((stage, idx) => {
                      const isExpanded = expandedStages.has(idx);
                      const accent = stageAccentColors[idx % stageAccentColors.length];
                      const numColor = stageNumberColors[idx % stageNumberColors.length];
                      return (
                        <motion.div
                          key={stage.name}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.06 }}
                          className={cn("rounded-2xl border transition-all duration-300", accent)}
                        >
                          {/* Stage header — clickable to expand/collapse */}
                          <button
                            onClick={() => toggleStage(idx)}
                            className="w-full flex items-center gap-4 p-5 text-left"
                          >
                            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 font-black text-sm", numColor)}>
                              {stage.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-heading font-black text-foreground text-base leading-tight">{stage.name}</p>
                              <p className="font-mono text-xs text-muted-foreground mt-0.5">{stage.duration} · {stage.items.length} topics</p>
                            </div>
                            <ChevronRight className={cn("h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200", isExpanded ? "rotate-90" : "")} />
                          </button>

                          {/* Stage items */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 space-y-3 border-t border-white/10">
                                  {stage.items.map((item, itemIdx) => (
                                    <motion.div
                                      key={item.topic}
                                      initial={{ opacity: 0, x: -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: itemIdx * 0.04 }}
                                      className="flex items-start gap-3 pt-3"
                                    >
                                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-sm font-bold text-foreground">{item.topic}</p>
                                        <p className="text-xs font-mono text-muted-foreground mt-0.5 leading-relaxed">{item.detail}</p>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
