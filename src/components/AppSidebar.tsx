import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Code2,
  Trophy,
  StickyNote,
  Target,
  User,
  Flame,
  GraduationCap,
  Route,
  CalendarRange,
  Focus,
  Users,
  Bot,
  Swords,
  Award,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type NavItem = { title: string; url: string; icon: typeof LayoutDashboard };

const primaryNav: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Learning Path", url: "/learning-path", icon: Route },
  { title: "Problems", url: "/problems", icon: Code2 },
  { title: "Weekly Challenges", url: "/weekly-challenges", icon: CalendarRange },
  { title: "Battle Arena", url: "/battle", icon: Swords },
  { title: "CodeT Assistant", url: "/codet", icon: Bot },
  { title: "Focus Mode", url: "/focus", icon: Focus },
];

const restNav: NavItem[] = [
  { title: "Friends", url: "/friends", icon: Users },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Notes", url: "/notes", icon: StickyNote },
  { title: "Courses", url: "/courses", icon: GraduationCap },
  { title: "Certification Center", url: "/certifications", icon: Award },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore scroll position on mount
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('sidebar-scroll');
    if (savedScroll && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sessionStorage.setItem('sidebar-scroll', e.currentTarget.scrollTop.toString());
  };

  const renderLink = (item: NavItem) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild tooltip={item.title} className="h-11 my-0.5">
        <NavLink
          to={item.url}
          end={item.url === "/"}
          className="relative group flex items-center rounded-xl transition-all duration-200 overflow-hidden px-4 hover:bg-primary/5 dark:hover:bg-primary/5 active:scale-95"
          activeClassName="bg-[#E6F4EA] dark:bg-primary/10 font-bold text-[#15803D] dark:text-primary"
        >
          {/* Active Indicator Bar */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r-full transition-all duration-300 group-[.active]:h-6 group-hover:h-4 group-hover:shadow-[0_0_15px_hsla(var(--primary),0.5)]" />
          
          <item.icon className={cn(
            "mr-3 h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110",
            "group-[.active]:text-primary"
          )} />
          {!collapsed && (
            <span className="font-heading text-sm tracking-tight group-hover:translate-x-1 transition-transform duration-200">
              {item.title}
            </span>
          )}
          
          {/* Subtle Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" id="tour-sidebar" className="border-r border-white/5 bg-sidebar/50 backdrop-blur-3xl transition-all duration-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20 ring-1 ring-white/20">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-black font-heading text-foreground tracking-tight leading-none text-gradient">CodeTrack</span>
              <span className="text-[10px] font-mono text-foreground/60 uppercase tracking-[0.2em] font-bold mt-1.5">v2.4.0 (Stable)</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent 
        className="px-3" 
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <SidebarGroup id="tour-sidebar-inner">
          <div className="px-3 mb-4 mt-2">
             <SidebarGroupLabel className="text-[#64748B] dark:text-primary uppercase text-[10px] tracking-[0.3em] font-bold font-mono">
                System Interface
             </SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {primaryNav.map(renderLink)}
              <div className="my-5 mx-3 h-px bg-gradient-to-r from-primary/30 via-primary/5 to-transparent" />
              <div className="px-3 mb-4">
                 <SidebarGroupLabel className="text-[#64748B] dark:text-primary uppercase text-[10px] tracking-[0.3em] font-bold font-mono">
                    Personal Space
                 </SidebarGroupLabel>
              </div>
              {restNav.map(renderLink)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Decorative background blur fixed to sidebar */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-[-1]" />
    </Sidebar>

  );
}

