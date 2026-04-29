import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, Command, Moon, Sun, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/" || location.pathname === "/dashboard";
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme === "dark" || (!savedTheme && document.documentElement.classList.contains("dark"));
    }
    return false;
  });
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(localStorage.getItem("profile-photo"));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateUser = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr) || { username: "User", email: "" };
          setUsername(user?.username || "User");
        } catch (e) {
          setUsername("User");
        }
      } else {
        setUsername("User");
      }
      setProfilePhoto(localStorage.getItem("profile-photo"));
    };

    updateUser();
    window.addEventListener("profile-photo-updated", updateUser);
    return () => window.removeEventListener("profile-photo-updated", updateUser);
  }, []);

  const initials = username
    ? username.split(" ").map(word => word[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = root.classList.contains("dark") ? "light" : "dark";
    
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
    
    setDarkMode(newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const SEARCH_ITEMS = [
    { name: "Dashboard", path: "/" },
    { name: "Learning Path", path: "/learning-path" },
    { name: "Problems", path: "/problems" },
    { name: "Weekly Challenges", path: "/weekly-challenges" },
    { name: "CodeT Assistant", path: "/codet" },
    { name: "Friends Space", path: "/friends" },
    { name: "Leaderboard", path: "/leaderboard" }
  ];

  const filteredSearch = SEARCH_ITEMS.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-yellow-400 text-black px-1 rounded-sm">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-2xl px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
        
        {isDashboard && (
          <div className="relative group h-9 flex items-center" id="tour-search">
            <div className="hidden sm:flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.05] px-4 h-9 text-sm text-muted-foreground backdrop-blur-xl transition-colors duration-300 focus-within:bg-foreground/[0.08] focus-within:ring-1 focus-within:ring-primary/40 focus-within:border-primary/40 shadow-2xl hover:bg-foreground/[0.08]">
              <Search className="h-3.5 w-3.5 text-foreground/60 transition-colors group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none font-mono text-xs w-64 text-foreground placeholder:text-foreground/50"
                value={query}
                onChange={handleSearch}
              />
              <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-foreground/10 border border-foreground/20">
                <Command className="h-2.5 w-2.5" />
                <span className="text-[9px] font-mono font-black">K</span>
              </div>
            </div>
            
            {/* Focus glow effect */}
            <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

            {query.trim().length > 0 && (
              <div className="absolute top-[calc(100%+0.5rem)] left-0 w-full rounded-2xl border border-foreground/10 bg-card/95 backdrop-blur-3xl shadow-2xl p-2 z-50 flex flex-col gap-1 overflow-hidden premium-border">
                {filteredSearch.length > 0 ? (
                  filteredSearch.map(item => (
                    <div
                      key={item.path}
                      onClick={() => { navigate(item.path); setQuery(""); }}
                      className="px-4 py-2.5 text-xs font-bold text-foreground/90 hover:bg-primary/10 hover:text-primary rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between group/result"
                    >
                      <span className="font-mono tracking-tight">{highlightText(item.name, query)}</span>
                      <div className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover/result:opacity-100 transition-opacity shadow-[0_0_8px_hsla(var(--primary),1)]" />
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-5 text-[10px] text-foreground/70 text-center font-mono uppercase tracking-[0.2em] font-black italic">
                    No matching modules
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="relative rounded-xl p-2.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200"
        >
          {!mounted ? (
            <div className="h-4 w-4 sm:h-4 sm:w-4" />
          ) : (
            darkMode ? <Sun className="h-4 w-4 sm:h-4 sm:w-4" /> : <Moon className="h-4 w-4 sm:h-4 sm:w-4" />
          )}
        </button>
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
            className="relative rounded-xl p-2.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200"
          >
            <Bell className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-lg p-3 z-50">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold font-heading text-foreground">Notifications</span>
              </div>
              <div className="flex flex-col items-center justify-center py-6 px-4 bg-muted/20 rounded-lg border border-border/30">
                <Bell className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-[11px] font-mono text-foreground/80 text-center font-semibold">No notifications yet</p>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <div 
            id="tour-profile"
            onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}
            className="h-9 w-9 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary font-mono cursor-pointer hover:bg-primary/20 transition-all overflow-hidden"
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt="User" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-lg p-1.5 z-50">
              <button 
                onClick={() => { setShowDropdown(false); navigate("/profile"); }} 
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg flex items-center gap-2"
              >
                Profile
              </button>
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-3 py-2 text-sm font-semibold text-white bg-destructive/80 hover:bg-destructive hover:brightness-110 rounded-lg flex items-center gap-2 mt-1 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
