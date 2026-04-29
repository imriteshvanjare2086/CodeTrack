import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import LearningPath from "./pages/LearningPath.tsx";
import Problems from "./pages/Problems.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import WeeklyChallenges from "./pages/WeeklyChallenges.tsx";
import Friends from "./pages/Friends.tsx";
import FocusMode from "./pages/FocusMode.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Profile from "./pages/Profile.tsx";
import Leaderboard from "./pages/Leaderboard.tsx";
import Notes from "./pages/Notes.tsx";
import Courses from "./pages/Courses.tsx";
import Goals from "./pages/Goals.tsx";
import CodeT from "./pages/CodeT.tsx";
import BattleArena from "./pages/BattleArena.tsx";
import Certifications from "./pages/Certifications.tsx";

const queryClient = new QueryClient();

const App = () => {
  const { ready, error } = useAuthBootstrap();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!ready ? (
          <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-6">
            <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl p-6 sm:p-8">
              <p className="text-sm font-mono text-gray-100 italic">Starting CodeTrack...</p>
              {error && <p className="text-xs font-mono text-red-400 mt-2">{error}</p>}
              <p className="text-[10px] font-mono text-gray-500 mt-4 leading-relaxed">
                If this hangs, please ensure the backend and MongoDB are running, then refresh the page.
              </p>
            </div>
          </div>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/dashboard/:userId" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/learning-path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
              <Route path="/problems" element={<ProtectedRoute><Problems /></ProtectedRoute>} />
              <Route path="/weekly-challenges" element={<ProtectedRoute><WeeklyChallenges /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
              <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/focus" element={<ProtectedRoute><FocusMode /></ProtectedRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/codet" element={<ProtectedRoute><CodeT /></ProtectedRoute>} />
              <Route path="/battle" element={<ProtectedRoute><BattleArena /></ProtectedRoute>} />
              <Route path="/certifications" element={<ProtectedRoute><Certifications /></ProtectedRoute>} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
