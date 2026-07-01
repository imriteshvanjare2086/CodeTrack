import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = (await login({ email, password })) as any;
      if (data && data.user) {
        const safeUser = {
          username: data?.user?.username || "User",
          email: data?.user?.email || ""
        };
        localStorage.setItem("user", JSON.stringify(safeUser));
        localStorage.setItem("token", data.token || "auth-token");
      }
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  const handleMockGoogleLogin = () => {
    const user = {
      username: "Sahil",
      email: "sahil@gmail.com"
    };
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", "mock-google-oauth-token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex items-center justify-center p-4 sm:p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl p-6 sm:p-8 space-y-5"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs font-mono text-gray-400 mt-1.5">Sign in to your CodeTrack account</p>
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
          {submitting ? "Signing in…" : "Sign in"}
        </Button>

        <Button
          type="button"
          className="w-full rounded-xl font-mono text-xs bg-green-600 hover:bg-green-500 text-white transition-all font-bold mt-2"
          onClick={handleMockGoogleLogin}
        >
          Quick Mock Login (For Testing)
        </Button>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] tracking-widest uppercase">
            <span className="bg-[#0a0a0a] px-3 text-gray-500 font-mono">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              console.log("Login success", credentialResponse);
              try {
                const data = await googleLogin(credentialResponse.credential!);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/";
              } catch (err) {
                console.error("Google login failed:", err);
                setError("Failed to sync with account. Please try again.");
              }
            }}
            onError={() => {
              console.log("Login Failed");
              setError("Google login failed");
            }}
            theme="filled_black"
            shape="pill"
            text="continue_with"
            size="large"
            width="100%"
          />
        </div>

        <p className="text-xs font-mono text-gray-500 text-center mt-6">
          New here?{" "}
          <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

