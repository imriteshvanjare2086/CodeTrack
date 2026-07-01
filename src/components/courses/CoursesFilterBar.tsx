import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "All", 
  "DSA", 
  "Web Development", 
  "System Design",
  "DBMS", 
  "Operating Systems", 
  "Computer Networks",
  "OOPs", 
  "SQL", 
  "C++", 
  "C", 
  "Python", 
  "Git & GitHub",
  "Game Development", 
  "UI/UX"
] as const;

interface CoursesFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  total: number;
  filtered: number;
}

export function CoursesFilterBar({
  search,
  setSearch,
  category,
  setCategory,
  total,
  filtered,
}: CoursesFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search courses by title or instructor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card/40 border-border/40 focus:bg-card/60 transition-all"
        />
      </div>

      {/* Category dropdown */}
      <div className="w-full sm:w-[200px]">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-card/40 border-border/40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Count badge */}
      <span className="shrink-0 font-mono text-xs text-muted-foreground whitespace-nowrap">
        {filtered} of {total} courses
      </span>
    </div>
  );
}
