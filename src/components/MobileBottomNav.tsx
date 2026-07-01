import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Code2, BookOpen, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { title: "Home", url: "/", icon: LayoutDashboard },
  { title: "Problems", url: "/problems", icon: Code2 },
  { title: "Study", url: "/study-hub", icon: BookOpen },
  { title: "Board", url: "/leaderboard", icon: Trophy },
  { title: "Profile", url: "/profile", icon: User },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Frosted glass bar */}
      <div className="flex items-center justify-around border-t border-white/10 bg-background/80 backdrop-blur-2xl px-2 py-1 safe-area-bottom">
        {mobileNavItems.map((item) => {
          const isActive =
            item.url === "/"
              ? location.pathname === "/" || location.pathname === "/dashboard"
              : location.pathname.startsWith(item.url);

          return (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className="flex flex-col items-center gap-0.5 min-w-[3.5rem] px-3 py-2 rounded-xl transition-all duration-200 active:scale-90"
              activeClassName=""
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
              </div>
              <span
                className={cn(
                  "text-[10px] font-mono font-bold tracking-tight transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
