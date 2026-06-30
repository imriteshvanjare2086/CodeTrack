import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = (await register({ username, email, password })) as any;
      if (data && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
      }
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex items-center justify-center p-4 sm:p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl p-6 sm:p-8 space-y-5"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-xs font-mono text-gray-400 mt-1.5">Join the CodeVerse community</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Email</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Password</label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:ring-primary/50"
          />
        </div>

        {error && <p className="text-xs font-mono text-red-400">{error}</p>}

        <Button type="submit" className="w-full rounded-xl font-mono text-xs bg-white text-black hover:bg-gray-200 transition-all font-bold mt-2" disabled={submitting}>
          {submitting ? "Creating…" : "Create account"}
        </Button>

        <p className="text-xs font-mono text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

