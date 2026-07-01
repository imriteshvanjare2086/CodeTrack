import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Video, 
  TrendingUp, 
  ExternalLink, 
  ChevronDown 
} from "lucide-react";
import {
  DSA_SHEETS,
  COURSES,
  ROADMAPS,
  COURSE_DOMAINS,
} from "@/data/study-hub";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function StudyHub() {
  const [selectedSection, setSelectedSection] = useState<string>("sheets");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);

  // Filter courses by selected domain
  const filteredCourses = useMemo(() => {
    if (selectedDomain === "All") return COURSES;
    return COURSES.filter(course => course.category === selectedDomain);
  }, [selectedDomain]);

  // Helper for difficulty colors
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 py-8 px-4">
        {/* Header */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white flex items-center gap-3">
              <span>📚</span> Study Hub
            </h1>
            <p className="text-muted-foreground text-base">
              Curated learning resources and interactive roadmaps for software engineers.
            </p>
          </div>

          {/* Navigation tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-white/[0.03] rounded-2xl border border-white/8 backdrop-blur-xl w-fit">
            <button
              onClick={() => setSelectedSection("sheets")}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm font-bold transition-all duration-300",
                selectedSection === "sheets"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
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
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
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
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
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
                <h2 className="text-2xl font-black font-heading text-white">DSA Sheets</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DSA_SHEETS.map((sheet) => (
                  <motion.div
                    key={sheet.id}
                    whileHover={{ y: -6 }}
                    className="rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <Badge variant="outline" className={getDifficultyColor(sheet.difficulty)}>
                          {sheet.difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-black text-white mb-1 tracking-tight">{sheet.title}</h3>
                      <p className="text-xs font-mono text-muted-foreground mb-3">By {sheet.author}</p>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{sheet.description}</p>
                    </div>
                    <Button
                      asChild
                      className="w-full h-11 justify-center gap-2 font-bold rounded-xl"
                    >
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
                  <h2 className="text-2xl font-black font-heading text-white">Courses</h2>
                </div>
                {/* Domain Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10 transition-all"
                  >
                    <span>Domain: {selectedDomain}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isDomainDropdownOpen ? "rotate-180" : "")} />
                  </button>
                  {isDomainDropdownOpen && (
                    <div className="absolute top-full right-0 mt-3 bg-[#111115] border border-white/10 rounded-2xl p-2 z-10 min-w-[220px] max-h-[300px] overflow-y-auto shadow-2xl">
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
                              : "text-muted-foreground hover:text-white hover:bg-white/5"
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
                <div className="glass rounded-3xl p-16 text-center border border-white/10 bg-white/5">
                  <p className="text-muted-foreground font-mono">No courses found for this domain.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ y: -6 }}
                      className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 w-full overflow-hidden bg-black/40">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                              <Badge variant="outline" className="text-xs font-mono text-muted-foreground border-white/10">
                                {course.duration}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-black text-white line-clamp-2 tracking-tight">{course.title}</h3>
                            <p className="text-xs font-mono text-muted-foreground">Instructor: {course.instructor}</p>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{course.description}</p>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <Button
                          asChild
                          className="w-full h-11 justify-center gap-2 font-bold rounded-xl"
                        >
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
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-black font-heading text-white">Roadmaps</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ROADMAPS.map((roadmap) => (
                  <motion.div
                    key={roadmap.id}
                    whileHover={{ y: -4 }}
                    className="rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl hover:border-primary/20 transition-all duration-300"
                  >
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{roadmap.title}</h3>
                    <p className="text-muted-foreground text-sm mb-8">{roadmap.description}</p>
                    <div className="space-y-8 relative">
                      {roadmap.stages.map((stage, idx) => (
                        <div key={stage.name} className="relative">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm shadow-md shadow-primary/20">
                              {idx + 1}
                            </div>
                            <h4 className="text-xl font-bold text-white">{stage.name}</h4>
                          </div>
                          {idx < roadmap.stages.length - 1 && (
                            <div className="ml-5 border-l-2 border-white/10 h-8 absolute left-0 top-10" />
                          )}
                          <div className="ml-5 pl-8 space-y-2">
                            {stage.items.map((item) => (
                              <div key={item} className="flex items-center gap-3 text-muted-foreground">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <span className="text-sm font-mono">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
