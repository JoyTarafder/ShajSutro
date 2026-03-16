"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getApiBase } from "@/lib/apiBase";

const API = getApiBase();

type View = "tabs" | "verify-email" | "forgot-password";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<View>("tabs");
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const subtitles: Record<View, string> = {
    "tabs": activeTab === "login" ? "Welcome back" : "Create your account",
    "verify-email": "Check your inbox",
    "forgot-password": "Reset your password",
  };

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-bold text-charcoal-950 hover:opacity-70 transition-opacity duration-300">
            ShajSutro
          </Link>
          <p className="text-charcoal-400 text-sm mt-3 font-light">
            {subtitles[view]}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-charcoal-100 overflow-hidden">
          {/* Tabs — only shown on main login/register view */}
          {view === "tabs" && (
          <div className="flex border-b border-charcoal-100">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-4.5 text-sm font-medium transition-all duration-300 ${
                activeTab === "login"
                  ? "text-charcoal-950 border-b-2 border-charcoal-950 bg-white"
                  : "text-charcoal-400 hover:text-charcoal-600 bg-charcoal-50/50"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-4.5 text-sm font-medium transition-all duration-300 ${
                activeTab === "register"
                  ? "text-charcoal-950 border-b-2 border-charcoal-950 bg-white"
                  : "text-charcoal-400 hover:text-charcoal-600 bg-charcoal-50/50"
              }`}
            >
              Create Account
            </button>
          </div>
          )}

          <div className="p-8 sm:p-9">
            {view === "verify-email" && pendingEmail ? (
              <VerifyEmailForm
                email={pendingEmail}
                onVerified={() => { setView("tabs"); setActiveTab("login"); setPendingEmail(null); }}
                onBack={() => { setView("tabs"); setPendingEmail(null); }}
              />
            ) : view === "forgot-password" ? (
              <ForgotPasswordFlow
                onBack={() => setView("tabs")}
                onDone={() => { setView("tabs"); setActiveTab("login"); }}
              />
            ) : activeTab === "login" ? (
              <LoginForm
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onForgotPassword={() => setView("forgot-password")}
              />
            ) : (
              <RegisterForm
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onRegistered={(email) => { setPendingEmail(email); setView("verify-email"); }}
              />
            )}
          </div>
        </div>

        <p className="text-center text-sm text-charcoal-300 mt-7 font-light">
          <Link href="/" className="hover:text-charcoal-600 transition-colors duration-300 group inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Social Buttons ────────────────────────────────────────────────────────────

function SocialButtons() {
  return (
    <div className="space-y-3 mb-7">
      <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-charcoal-200 rounded-xl text-sm font-medium text-charcoal-600 hover:bg-charcoal-50 hover:border-charcoal-300 transition-all duration-300 hover:shadow-soft">
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
      <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-charcoal-200 rounded-xl text-sm font-medium text-charcoal-600 hover:bg-charcoal-50 hover:border-charcoal-300 transition-all duration-300 hover:shadow-soft">
        <svg className="w-4 h-4 text-charcoal-900" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
        </svg>
        Continue with Apple
      </button>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative flex items-center gap-4 mb-7">
      <div className="flex-1 h-px bg-charcoal-100" />
      <span className="text-xs text-charcoal-300 font-medium tracking-wide">or</span>
      <div className="flex-1 h-px bg-charcoal-100" />
    </div>
  );
}

// ─── Login Form ────────────────────────────────────────────────────────────────

function LoginForm({
  showPassword,
  setShowPassword,
  onForgotPassword,
}: {
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  onForgotPassword: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Login failed");
      localStorage.setItem("token", data.token);
      router.push("/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <SocialButtons />
      <Divider />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-charcoal-600 mb-2">Email Address</label>
        <input
          type="email"
          className="input-field"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-medium text-charcoal-600">Password</label>
          <button type="button" onClick={onForgotPassword} className="text-xs text-accent-600 hover:text-accent-700 transition-colors font-medium">Forgot password?</button>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="input-field pr-10"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-600 transition-colors duration-300"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-charcoal-300 text-charcoal-950 focus:ring-charcoal-950" />
        <label htmlFor="remember" className="text-sm text-charcoal-500 font-light">Remember me for 30 days</label>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <Spinner /> : "Sign In"}
      </button>
    </form>
  );
}

// ─── Register Form ─────────────────────────────────────────────────────────────

function RegisterForm({
  showPassword,
  setShowPassword,
  onRegistered,
}: {
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  onRegistered: (email: string) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service.");
      return;
    }
    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Registration failed");
      onRegistered(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <SocialButtons />
      <Divider />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-charcoal-600 mb-2">First Name</label>
          <input
            type="text"
            className="input-field"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-charcoal-600 mb-2">Last Name</label>
          <input
            type="text"
            className="input-field"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-charcoal-600 mb-2">Email Address</label>
        <input
          type="email"
          className="input-field"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-charcoal-600 mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="input-field pr-10"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-600 transition-colors duration-300"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded border-charcoal-300 text-charcoal-950 focus:ring-charcoal-950"
        />
        <label htmlFor="terms" className="text-sm text-charcoal-500 font-light">
          I agree to the{" "}
          <a href="#" className="text-accent-600 hover:text-accent-700 transition-colors font-medium">Terms of Service</a> and{" "}
          <a href="#" className="text-accent-600 hover:text-accent-700 transition-colors font-medium">Privacy Policy</a>
        </label>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <Spinner /> : "Create Account"}
      </button>
    </form>
  );
}

// ─── Forgot Password Flow (3 steps) ──────────────────────────────────────────

type FPStep = "email" | "otp" | "new-password";

function ForgotPasswordFlow({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState<FPStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  return (
    <>
      {step === "email" && (
        <FPStepEmail
          onSent={(e) => { setEmail(e); setStep("otp"); }}
          onBack={onBack}
        />
      )}
      {step === "otp" && (
        <FPStepOTP
          email={email}
          onVerified={(c) => { setCode(c); setStep("new-password"); }}
          onBack={() => setStep("email")}
        />
      )}
      {step === "new-password" && (
        <FPStepNewPassword
          email={email}
          code={code}
          onDone={onDone}
          onBack={() => setStep("otp")}
        />
      )}
    </>
  );
}

// Step 1 — Enter email
function FPStepEmail({
  onSent,
  onBack,
}: {
  onSent: (email: string) => void;
  onBack: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to send code");
      onSent(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col items-center gap-3 pb-2">
        <div className="w-14 h-14 rounded-full bg-charcoal-50 border border-charcoal-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-charcoal-700">Forgot your password?</p>
          <p className="text-xs text-charcoal-400 mt-1 font-light leading-relaxed">
            Enter your email and we&apos;ll send a 6-digit reset code.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-charcoal-600 mb-2">Email Address</label>
        <input
          type="email"
          className="input-field"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <Spinner /> : "Send Reset Code"}
      </button>

      <button type="button" onClick={onBack} className="w-full text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors py-1 inline-flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Sign In
      </button>
    </form>
  );
}

// Step 2 — Enter OTP
function FPStepOTP({
  email,
  onVerified,
  onBack,
}: {
  email: string;
  onVerified: (code: string) => void;
  onBack: () => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(6).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = digits.join("");
    if (code.length < 6) { setError("Please enter the full 6-digit code."); return; }
    setLoading(true);
    try {
      // Just validate format locally — actual check happens on reset-password
      onVerified(code);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setCooldown(60);
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch { /* silent */ }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-3 pb-2">
        <div className="w-14 h-14 rounded-full bg-charcoal-50 border border-charcoal-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-charcoal-700">Enter the reset code</p>
          <p className="text-xs text-charcoal-400 mt-0.5 font-light">{email}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-11 text-center text-lg font-semibold border rounded-xl outline-none transition-all duration-200
              ${digit ? "border-charcoal-700 bg-charcoal-50 text-charcoal-950" : "border-charcoal-200 bg-white text-charcoal-950"}
              focus:border-charcoal-700 focus:ring-2 focus:ring-charcoal-200 focus:bg-white`}
            style={{ height: "52px" }}
          />
        ))}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <Spinner /> : "Continue"}
      </button>

      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={onBack} className="text-charcoal-400 hover:text-charcoal-600 transition-colors font-light inline-flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button type="button" onClick={handleResend} disabled={cooldown > 0} className="text-accent-600 hover:text-accent-700 font-medium transition-colors disabled:text-charcoal-300 disabled:cursor-not-allowed">
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}

// Step 3 — New Password
function FPStepNewPassword({
  email,
  code,
  onDone,
  onBack,
}: {
  email: string;
  code: string;
  onDone: () => void;
  onBack: () => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm]         = useState("");
  const [show, setShow]               = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Reset failed");
      setSuccess("Password reset successfully! Redirecting to Sign In…");
      setTimeout(onDone, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col items-center gap-3 pb-2">
        <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-charcoal-700">Set a new password</p>
          <p className="text-xs text-charcoal-400 mt-1 font-light">Choose a strong password for your account.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {[
        { label: "New Password",     value: newPassword, onChange: setNewPassword, placeholder: "Min. 6 characters" },
        { label: "Confirm Password", value: confirm,     onChange: setConfirm,     placeholder: "Repeat new password" },
      ].map(({ label, value, onChange, placeholder }) => (
        <div key={label}>
          <label className="block text-xs font-medium text-charcoal-600 mb-2">{label}</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              className="input-field pr-11"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-600 transition-colors">
              <EyeIcon open={show} />
            </button>
          </div>
        </div>
      ))}

      <button type="submit" disabled={loading || !!success} className="btn-primary w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <Spinner /> : "Reset Password"}
      </button>

      <button type="button" onClick={onBack} className="w-full text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors py-1 inline-flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </form>
  );
}

// ─── Verify Email Form (OTP Step) ─────────────────────────────────────────────

function VerifyEmailForm({
  email,
  onVerified,
  onBack,
}: {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start 60-second resend cooldown on mount
  useEffect(() => {
    setCooldown(60);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    // Accept only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(6).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = digits.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Verification failed");
      if (data.token) localStorage.setItem("token", data.token);
      setSuccess("Email verified! Redirecting…");
      setTimeout(() => {
        onVerified();
        router.push("/profile");
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to resend");
      setSuccess("A new code has been sent to your email.");
      setCooldown(60);
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }, [email]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email icon */}
      <div className="flex flex-col items-center gap-3 pb-2">
        <div className="w-14 h-14 rounded-full bg-charcoal-50 border border-charcoal-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-charcoal-700">Verification code sent to</p>
          <p className="text-sm text-charcoal-400 font-light mt-0.5">{email}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 text-center">
          {success}
        </div>
      )}

      {/* 6-digit OTP input */}
      <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-11 h-13 text-center text-lg font-semibold border rounded-xl outline-none transition-all duration-200
              ${digit
                ? "border-charcoal-700 bg-charcoal-50 text-charcoal-950"
                : "border-charcoal-200 bg-white text-charcoal-950"
              }
              focus:border-charcoal-700 focus:ring-2 focus:ring-charcoal-200 focus:bg-white`}
            style={{ height: "52px" }}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading || !!success}
        className="btn-primary w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Spinner /> : "Verify Email"}
      </button>

      {/* Resend + Back */}
      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-charcoal-400 hover:text-charcoal-600 transition-colors font-light inline-flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="text-accent-600 hover:text-accent-700 font-medium transition-colors disabled:text-charcoal-300 disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}

// ─── Shared small components ───────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      )}
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin mx-auto h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
