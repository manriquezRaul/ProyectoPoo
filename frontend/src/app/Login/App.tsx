import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const BRAND = {
  name: "MenteColmena",
  tagline: "Your AI-powered study companion.",
  year: 2026,
};

const FEATURES: { icon: string; label: string }[] = [
  { icon: "🧠", label: "Adaptive AI tutoring" },
  { icon: "📚", label: "Smart flashcard generation" },
  { icon: "📊", label: "Progress analytics" },
  { icon: "🎓", label: "University-grade resources" },
];

const TESTIMONIAL = {
  quote:
    "MenteColmena cut my study time in half. The AI explains complex topics in ways that actually stick.",
  author: "Laura Mendoza",
  role: "Biomedical Engineering · UNAM",
  initials: "L",
};

// ─── HoneycombLogo ────────────────────────────────────────────────────────────

function HoneycombLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon points="24,10 34,16 34,28 24,34 14,28 14,16" fill="#2563EB" opacity="0.9" />
      <polygon points="10,2 18,6.5 18,15.5 10,20 2,15.5 2,6.5"    fill="#2563EB" opacity="0.35" />
      <polygon points="38,2 46,6.5 46,15.5 38,20 30,15.5 30,6.5"   fill="#2563EB" opacity="0.55" />
      <polygon points="10,28 18,32.5 18,41.5 10,46 2,41.5 2,32.5"  fill="#2563EB" opacity="0.45" />
      <polygon points="38,28 46,32.5 46,41.5 38,46 30,41.5 30,32.5" fill="#2563EB" opacity="0.6" />
      <polygon points="24,16 29,19 29,25 24,28 19,25 19,19" fill="white" opacity="0.25" />
    </svg>
  );
}

// ─── FeaturePill ──────────────────────────────────────────────────────────────

function FeaturePill({ icon, label }: { icon: string; label: string }) {
  return (
    <li className="flex items-center gap-[8px] px-[16px] h-[36px] rounded-full bg-white/20 border border-white/30 list-none">
      <span className="text-[16px] leading-none" aria-hidden="true">{icon}</span>
      <span
        className="text-[13px] font-[500] leading-none text-white/90 whitespace-nowrap"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {label}
      </span>
    </li>
  );
}

// ─── BrandingPanel (from imported design) ────────────────────────────────────

function BrandingPanel() {
  return (
    <aside
      className="hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #dbeafe 0%, #bfdbfe 35%, #93c5fd 70%, #60a5fa 100%)",
      }}
      aria-label="MenteColmena branding"
    >
      {/* Hex-grid watermark */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex-bg" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon
                points="30,2 56,16 56,44 30,58 4,44 4,16"
                fill="none"
                stroke="#1e40af"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-bg)" />
        </svg>
      </div>

      {/* Glow orbs */}
      <div className="absolute top-[64px] right-[64px] w-[192px] h-[192px] rounded-full bg-blue-300/30 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[96px] left-[48px] w-[256px] h-[256px] rounded-full bg-blue-500/20 blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Main content column */}
      <div className="relative z-10 flex flex-col items-center text-center px-[48px] gap-[32px] max-w-[480px] w-full">

        {/* Logo lockup */}
        <header className="flex flex-col items-center gap-[16px]">
          <div className="p-[16px] rounded-[16px] bg-white/30 backdrop-blur-md shadow-lg border border-white/40">
            <HoneycombLogo size={52} />
          </div>
          <div className="flex flex-col items-center gap-[6px]">
            <h1
              className="text-[36px] font-[600] text-[#1e3a8a] tracking-[-0.5px] leading-[1.2]"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              {BRAND.name}
            </h1>
            <p className="text-[15px] font-[300] leading-[1.5] text-[#1e40af]/80 tracking-[0.2px]">
              {BRAND.tagline}
            </p>
          </div>
        </header>

        {/* Divider */}
        <div className="w-[64px] h-[1px] bg-[#60a5fa]/50" aria-hidden="true" />

        {/* Features list */}
        <ul className="flex flex-col gap-[12px] items-center w-full">
          {FEATURES.map((f) => (
            <FeaturePill key={f.label} icon={f.icon} label={f.label} />
          ))}
        </ul>

        {/* Testimonial card */}
        <figure className="w-full max-w-[280px] bg-white/25 backdrop-blur-sm rounded-[16px] border border-white/35 p-[20px] text-left">
          <blockquote>
            <p className="text-[13px] font-[400] leading-[1.6] text-[#1e3a8a]/80 italic">
              "{TESTIMONIAL.quote}"
            </p>
          </blockquote>
          <figcaption className="mt-[12px] flex items-center gap-[8px]">
            <div
              className="w-[28px] h-[28px] rounded-full bg-[#60a5fa]/60 flex items-center justify-center text-[11px] font-[600] text-white shrink-0"
              aria-hidden="true"
            >
              {TESTIMONIAL.initials}
            </div>
            <div className="flex flex-col gap-[1px]">
              <p className="text-[12px] font-[600] leading-[1.4] text-[#1e3a8a]">
                {TESTIMONIAL.author}
              </p>
              <p className="text-[11px] font-[400] leading-[1.4] text-[#1d4ed8]/70">
                {TESTIMONIAL.role}
              </p>
            </div>
          </figcaption>
        </figure>

      </div>
    </aside>
  );
}

// ─── Auth Form (right panel) ──────────────────────────────────────────────────

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isLogin = mode === "login";

  return (
    <main
      className="w-full min-h-screen flex flex-row"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── LEFT: Branding Panel ── */}
      <BrandingPanel />

      {/* ── RIGHT: Auth Form ── */}
      <section
        className="w-full lg:w-1/2 flex items-center justify-center bg-white px-[24px] py-[48px] overflow-y-auto"
        aria-label="Authentication form"
      >
        <div className="w-full max-w-[448px]">

          {/* Mobile logo (hidden ≥ lg) */}
          <header className="lg:hidden flex items-center justify-center gap-[12px] mb-[32px]">
            <HoneycombLogo size={32} />
            <span
              className="text-[22px] font-[600] leading-[1.2] text-[#1e3a8a]"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              {BRAND.name}
            </span>
          </header>

          {/* Heading */}
          <div className="mb-[32px]">
            <h2 className="text-[24px] font-[600] leading-[1.3] tracking-[-0.3px] text-[#1e293b]">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-[6px] text-[14px] font-[400] leading-[1.5] text-[#64748b]">
              {isLogin
                ? "Sign in to continue your study session."
                : "Join thousands of students already learning smarter."}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-[20px]"
            noValidate
          >
            {/* Full Name — sign-up only */}
            {!isLogin && (
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="fullName" className="text-[13px] font-[500] leading-[1.5] text-[#475569]">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Raúl García Herrera"
                  className="w-full h-[44px] px-[16px] rounded-[12px] border border-[#E5E7EB] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] bg-white outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-[border-color,box-shadow] duration-150"
                />
              </div>
            )}

            {/* University Email */}
            <div className="flex flex-col gap-[6px]">
              <label htmlFor="email" className="text-[13px] font-[500] leading-[1.5] text-[#475569]">
                University Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="r.garcia@universidad.edu.mx"
                className="w-full h-[44px] px-[16px] rounded-[12px] border border-[#E5E7EB] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] bg-white outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-[border-color,box-shadow] duration-150"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[13px] font-[500] leading-[1.5] text-[#475569]">
                  {isLogin ? "Password" : "Create Password"}
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-[12px] font-[500] text-[#2563EB] hover:text-[#1d4ed8] transition-colors duration-150"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full h-[44px] pl-[16px] pr-[44px] rounded-[12px] border border-[#E5E7EB] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] bg-white outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-[border-color,box-shadow] duration-150"
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-0 top-0 w-[44px] h-[44px] flex items-center justify-center text-[#94a3b8] hover:text-[#475569] transition-colors duration-150"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password — sign-up only */}
            {!isLogin && (
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="confirmPassword" className="text-[13px] font-[500] leading-[1.5] text-[#475569]">
                  Confirm Password
                </label>
                <div className="relative w-full">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className="w-full h-[44px] px-[16px] rounded-[12px] border border-[#E5E7EB] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] bg-white outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-[border-color,box-shadow] duration-150"
                  />
                </div>
              </div>
            )}

            {/* Terms notice — sign-up only */}
            {!isLogin && (
              <p className="mt-[-4px] text-[12px] font-[400] leading-[1.6] text-[#94a3b8]">
                By creating an account you agree to our{" "}
                <a href="#" className="text-[#2563EB] hover:text-[#1d4ed8] underline underline-offset-[3px] transition-colors duration-150">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#2563EB] hover:text-[#1d4ed8] underline underline-offset-[3px] transition-colors duration-150">
                  Privacy Policy
                </a>.
              </p>
            )}

            {/* CTA Button */}
            <button
              type="submit"
              className="w-full h-[48px] rounded-[12px] bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white text-[14px] font-[600] leading-none tracking-[0.1px] shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle login / signup */}
          <p className="mt-[24px] text-center text-[14px] font-[400] leading-[1.5] text-[#64748b]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(isLogin ? "signup" : "login")}
              className="font-[600] text-[#2563EB] hover:text-[#1d4ed8] hover:underline underline-offset-[3px] transition-colors duration-150 cursor-pointer bg-transparent border-none p-0"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>

          {/* Footer */}
          <footer className="mt-[40px] text-center">
            <p className="text-[11px] font-[400] leading-[1.5] text-[#cbd5e1]">
              © {BRAND.year} {BRAND.name} · All rights reserved
            </p>
          </footer>

        </div>
      </section>
    </main>
  );
}
