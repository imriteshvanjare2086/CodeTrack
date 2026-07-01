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
  type DsaSheet,
  type Course,
  type Roadmap
} from "@/data/study-hub";

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
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 py-8 px-4">
        {/* Header */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight">
              📚 Study Hub
            </h1>
            <p className="text-muted-foreground text-lg">
              Curated learning resources for aspiring software engineers
            </p>
          </div>

          {/* Tabs for Sections */}
          <div className="flex flex-wrap gap-3 bg-[#161618] p-2 rounded-2xl border border-white/10">
            <button
              onClick={() => setSelectedSection("sheets")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                selectedSection === "sheets"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <BookOpen className="h-5 w-5" />
              DSA Sheets
            </button>
            <button
              onClick={() => setSelectedSection("courses")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                selectedSection === "courses"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Video className="h-5 w-5" />
              Courses
            </button>
            <button
              onClick={() => setSelectedSection("roadmaps")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                selectedSection === "roadmaps"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              Roadmaps
            </button>
          </div>
        </div>

        {/* 📄 DSA Sheets Section */}
        {selectedSection === "sheets" && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-black font-heading">DSA Sheets</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DSA_SHEETS.map((sheet) => (
                <div
                  key={sheet.id}
                  className="glass-strong rounded-3xl p-6 border border-white/10 bg-[#252535] hover:scale-[1.02] transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <Badge className={getDifficultyColor(sheet.difficulty)}>
                      {sheet.difficulty}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black mb-2">{sheet.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">By {sheet.author}</p>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{sheet.description}</p>
                  <Button
                    asChild
                    className="w-full h-11 justify-center gap-2 font-bold"
                  >
                    <a href={sheet.url} target="_blank" rel="noreferrer">
                      Open Sheet
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 🎥 Courses Section */}
        {selectedSection === "courses" && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <Video className="h-7 w-7 text-primary" />
                <h2 className="text-2xl font-black font-heading">Courses</h2>
              </div>
              {/* Domain Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/10 bg-[#252535] text-sm font-bold hover:bg-white/5 transition-all"
                >
                  <span>Domain: {selectedDomain}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDomainDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isDomainDropdownOpen && (
                  <div className="absolute top-full right-0 mt-3 bg-[#1a1a2e] border border-white/10 rounded-2xl p-2 z-10 min-w-[220px] max-h-[400px] overflow-y-auto shadow-2xl">
                    {COURSE_DOMAINS.map((domain) => (
                      <button
                        key={domain}
                        onClick={() => {
                          setSelectedDomain(domain);
                          setIsDomainDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedDomain === domain
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
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
              <div className="glass rounded-3xl p-12 text-center border border-white/10">
                <p className="text-muted-foreground">No courses found for this domain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="glass-strong rounded-3xl overflow-hidden border border-white/10 bg-[#252535] hover:scale-[1.02] transition-all duration-300 hover:shadow-xl"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop";
                      }}
                    />
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <Badge className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </Badge>
                        {course.duration && (
                          <Badge variant="outline" className="text-xs font-mono">
                            {course.duration}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-black line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.instructor}</p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                      <Button
                        asChild
                        className="w-full h-11 justify-center gap-2 font-bold"
                      >
                        <a href={course.playlistUrl} target="_blank" rel="noreferrer">
                          Open Playlist
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 🛣️ Roadmaps Section */}
        {selectedSection === "roadmaps" && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-black font-heading">Roadmaps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ROADMAPS.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="glass-strong rounded-3xl p-8 border border-white/10 bg-[#252535] hover:scale-[1.01] transition-all duration-300 hover:shadow-xl"
                >
                  <h3 className="text-2xl font-black mb-2">{roadmap.title}</h3>
                  <p className="text-muted-foreground text-sm mb-8">{roadmap.description}</p>
                  <div className="space-y-8">
                    {roadmap.stages.map((stage, idx) => (
                      <div key={stage.name} className="relative">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">
                            {idx + 1}
                          </div>
                          <h4 className="text-xl font-bold">{stage.name}</h4>
                        </div>
                        {idx < roadmap.stages.length - 1 && (
                          <div className="ml-5 border-l-2 border-white/10 h-8 absolute left-0 top-10" />
                        )}
                        <div className="ml-5 pl-8 space-y-2">
                          {stage.items.map((item) => (
                            <div key={item} className="flex items-center gap-3 text-muted-foreground">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
