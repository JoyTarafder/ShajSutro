"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-bold text-charcoal-950 hover:opacity-70 transition-opacity duration-300">
            ShajSutro
          </Link>
          <p className="text-charcoal-400 text-sm mt-3 font-light">
            {activeTab === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-charcoal-100 overflow-hidden">
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

          <div className="p-8 sm:p-9">
            {activeTab === "login" ? (
              <LoginForm showPassword={showPassword} setShowPassword={setShowPassword} />
            ) : (
              <RegisterForm showPassword={showPassword} setShowPassword={setShowPassword} />
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

function LoginForm({ showPassword, setShowPassword }: { showPassword: boolean; setShowPassword: (v: boolean) => void }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
      <SocialButtons />
      <Divider />

      <div>
        <label className="block text-xs font-medium text-charcoal-600 mb-2">Email Address</label>
        <input type="email" className="input-field" placeholder="you@example.com" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-medium text-charcoal-600">Password</label>
          <a href="#" className="text-xs text-accent-600 hover:text-accent-700 transition-colors font-medium">Forgot password?</a>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="input-field pr-10"
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-600 transition-colors duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showPassword ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-charcoal-300 text-charcoal-950 focus:ring-charcoal-950" />
        <label htmlFor="remember" className="text-sm text-charcoal-500 font-light">Remember me for 30 days</label>
      </div>

      <button type="submit" className="btn-primary w-full py-4">
        Sign In
      </button>
    </form>
  );
}

function RegisterForm({ showPassword, setShowPassword }: { showPassword: boolean; setShowPassword: (v: boolean) => void }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
      <SocialButtons />
      <Divider />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-charcoal-600 mb-2">First Name</label>
          <input type="text" className="input-field" placeholder="John" />
        </div>
        <div>
          <label className="block text-xs font-medium text-charcoal-600 mb-2">Last Name</label>
          <input type="text" className="input-field" placeholder="Doe" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-charcoal-600 mb-2">Email Address</label>
        <input type="email" className="input-field" placeholder="you@example.com" />
      </div>

      <div>
        <label className="block text-xs font-medium text-charcoal-600 mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="input-field pr-10"
            placeholder="Min. 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-600 transition-colors duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2.5">
        <input type="checkbox" id="terms" className="w-4 h-4 mt-0.5 rounded border-charcoal-300 text-charcoal-950 focus:ring-charcoal-950" />
        <label htmlFor="terms" className="text-sm text-charcoal-500 font-light">
          I agree to the{" "}
          <a href="#" className="text-accent-600 hover:text-accent-700 transition-colors font-medium">Terms of Service</a> and{" "}
          <a href="#" className="text-accent-600 hover:text-accent-700 transition-colors font-medium">Privacy Policy</a>
        </label>
      </div>

      <button type="submit" className="btn-primary w-full py-4">
        Create Account
      </button>
    </form>
  );
}
