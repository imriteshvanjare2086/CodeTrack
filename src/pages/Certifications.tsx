import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Award, ExternalLink, Star, Filter, ChevronDown, LayoutGrid, ListFilter } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import certificationsData from "@/data/certifications.json";

interface Certification {
  id: number;
  title: string;
  platform: string;
  domain: string;
  type: string;
  rating: number;
  image: string;
  url: string;
}

const domains = ["All", "C", "C++", "Python", "Web Development", "OOPs", "DSA", "Cloud Computing", "Data Science"];

export default function Certifications() {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const filteredCertifications = useMemo(() => {
    let result = (certificationsData as Certification[]).filter((cert) => {
      const matchesDomain = selectedDomain === "All" || cert.domain === selectedDomain;
      const matchesSearch = cert.title.toLowerCase().includes(search.toLowerCase()) || 
                           cert.platform.toLowerCase().includes(search.toLowerCase());
      return matchesDomain && matchesSearch;
    });

    if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "platform") {
      result = [...result].sort((a, b) => a.platform.localeCompare(b.platform));
    }

    return result;
  }, [search, selectedDomain, sortBy]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 pb-20">
        <PageHeader
          title="Certification Center"
          description="Level up your career with top-rated certification courses from global learning platforms."
        />

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white dark:bg-[#1A1A1E] p-6 rounded-3xl border border-[#E2E8F0] dark:border-white/5 shadow-premium dark:shadow-2xl">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search courses or platforms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-black/40 border border-[#E2E8F0] dark:border-white/5 rounded-2xl py-3 pl-12 pr-4 text-[#1E293B] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-mono text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Domain Filter */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/5 text-[#64748B] dark:text-slate-500">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="w-full sm:w-[200px] bg-[#F8FAFC] dark:bg-black/40 border-[#E2E8F0] dark:border-white/5 rounded-xl h-11 text-[#475569] dark:text-slate-300 font-mono text-xs font-bold uppercase tracking-widest focus:ring-primary/40">
                  <SelectValue placeholder="Select Domain" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1A1A1E] border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-slate-300 font-mono">
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain} className="text-xs uppercase tracking-widest focus:bg-primary focus:text-primary-foreground">
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/5 text-[#64748B] dark:text-slate-500">
                <ListFilter className="w-4 h-4" />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px] bg-[#F8FAFC] dark:bg-black/40 border-[#E2E8F0] dark:border-white/5 rounded-xl h-11 text-[#475569] dark:text-slate-300 font-mono text-xs font-bold uppercase tracking-widest focus:ring-primary/40">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1A1A1E] border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-slate-300 font-mono">
                  <SelectItem value="default" className="text-xs uppercase tracking-widest">Default Order</SelectItem>
                  <SelectItem value="rating" className="text-xs uppercase tracking-widest">Top Rated</SelectItem>
                  <SelectItem value="platform" className="text-xs uppercase tracking-widest">Platform (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCertifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-blue-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-white dark:bg-[#1A1A1E] border border-[#E2E8F0] dark:border-white/10 rounded-3xl overflow-hidden h-full flex flex-col hover:border-primary/30 transition-colors shadow-premium dark:shadow-2xl">
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={cert.image} 
                      alt={cert.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1A1A1E] to-transparent opacity-60" />
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 rounded-lg bg-white/80 dark:bg-black/60 backdrop-blur-md border border-[#E2E8F0] dark:border-white/10 text-[10px] font-mono font-bold text-[#15803D] dark:text-primary uppercase tracking-widest">
                        {cert.platform}
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/80 dark:bg-black/60 backdrop-blur-md border border-[#E2E8F0] dark:border-white/10">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-mono font-bold text-[#1E293B] dark:text-white">{cert.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.2em]">
                          {cert.type}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                        <span className="text-[10px] font-mono font-bold text-[#64748B] dark:text-slate-500 uppercase tracking-[0.2em]">
                          {cert.domain}
                        </span>
                      </div>
                      <h3 className="text-lg font-heading font-bold text-[#1E293B] dark:text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {cert.title}
                      </h3>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#E2E8F0] dark:border-white/5">
                      <div className="flex items-center gap-2 text-emerald-500/80">
                        <Award className="w-4 h-4 fill-emerald-500/10" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Official Certificate</span>
                      </div>
                      <a 
                        href={cert.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-bold hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all duration-300 group/btn"
                      >
                        Enroll Now
                        <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCertifications.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
              <Search className="w-10 h-10 text-slate-700" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white">No certifications found</h3>
            <p className="text-slate-500 mt-2 font-mono text-sm max-w-xs">
              Try adjusting your search or domain filter to find what you're looking for.
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
