import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Swal from "sweetalert2";
import axios from "axios";
import { supabase as auth } from "../lib/supabase";
import { Turnstile } from "@marsidev/react-turnstile";

const rawEnvKey = (import.meta.env.TURNSTILE_SITE_KEY || "").trim();
const TURNSTILE_SITE_KEY =
  rawEnvKey.length > 5 ? rawEnvKey : "0x4AAAAAADDNPyGBIV4MApep";

interface AuthViewProps {
  initialMode: "login" | "signup";
  setActiveView: (view: any) => void;
  siteSettings?: any;
}

export const AuthView: React.FC<AuthViewProps> = React.memo(
  ({ initialMode, setActiveView, siteSettings }) => {
    const siteName = siteSettings?.site_name || "DEV";
    const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">(
      initialMode
    );
    // 2-step login: 1 = Enter Username, 2 = Enter Password
    const [loginStep, setLoginStep] = useState<1 | 2>(1);

    const [authUsername, setAuthUsername] = useState("");
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [authConfirmPassword, setAuthConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    const usernameInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setAuthMode(initialMode);
      setLoginStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [initialMode]);

    // Auto-focus username when on Step 1
    useEffect(() => {
      if (authMode === "login" && loginStep === 1) {
        setTimeout(() => usernameInputRef.current?.focus(), 150);
      } else if (authMode === "login" && loginStep === 2) {
        setTimeout(() => passwordInputRef.current?.focus(), 150);
      }
    }, [authMode, loginStep]);

    const handleStep1Next = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const trimmed = authUsername.trim();
      if (!trimmed) {
        Swal.fire({
          icon: "warning",
          title: "กรุณากรอกชื่อผู้ใช้",
          text: "โปรดระบุชื่อผู้ใช้ของคุณเพื่อดำเนินการต่อ",
          background: "#0c0d12",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
        });
        usernameInputRef.current?.focus();
        return;
      }
      setLoginStep(2);
    };

    const handleAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      if (TURNSTILE_SITE_KEY && !turnstileToken) {
        Swal.fire({
          icon: "warning",
          title: "โปรดยืนยันตัวตน",
          text: "กรุณายืนยันการตรวจสอบระบบความปลอดภัย",
          background: "#0c0d12",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
        });
        return;
      }
      await executeAuth(turnstileToken || "bypass");
    };

    const executeAuth = async (
      currentToken: string | null = turnstileToken
    ) => {
      if (
        (authMode === "signup" || authMode === "forgot") &&
        authPassword !== authConfirmPassword
      ) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน",
          background: "#0c0d12",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
        });
        return;
      }

      setAuthLoading(true);
      try {
        const generatedEmail = `${authUsername
          .toLowerCase()
          .replace(/\s+/g, "")}@apex-studio.com`;

        if (authMode === "signup") {
          try {
            const res = await axios.post("/api/signup", {
              email: generatedEmail,
              password: authPassword,
              recoveryEmail: authEmail,
            });
            if (res.data.error) {
              throw new Error(res.data.error);
            }
          } catch (e: any) {
            throw new Error(e.response?.data?.error || e.message);
          }

          Swal.fire({
            icon: "success",
            title: "สมัครสมาชิกสำเร็จ",
            text: "บัญชีของคุณพร้อมใช้งานแล้ว กรุณาเข้าสู่ระบบ",
            timer: 1600,
            showConfirmButton: false,
            background: "#0c0d12",
            color: "#fff",
          });
          setAuthMode("login");
          setLoginStep(1);
          setAuthPassword("");
          setAuthConfirmPassword("");
        } else if (authMode === "forgot") {
          try {
            const res = await axios.post("/api/reset-password", {
              username: authUsername,
              email: authEmail,
              newPassword: authPassword,
            });
            if (res.data.error) {
              throw new Error(res.data.error);
            }
          } catch (e: any) {
            throw new Error(e.response?.data?.error || e.message);
          }

          Swal.fire({
            icon: "success",
            title: "รีเซ็ตรหัสผ่านสำเร็จ",
            text: "ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว กรุณาเข้าสู่ระบบ",
            timer: 1600,
            showConfirmButton: false,
            background: "#0c0d12",
            color: "#fff",
          });
          setAuthMode("login");
          setLoginStep(1);
          setAuthPassword("");
          setAuthConfirmPassword("");
        } else {
          const { data, error } = await auth.auth.signInWithPassword({
            email: generatedEmail,
            password: authPassword,
          });

          if (error) {
            throw new Error(error.message);
          }

          Swal.fire({
            icon: "success",
            title: "เข้าสู่ระบบสำเร็จ",
            timer: 1400,
            showConfirmButton: false,
            background: "#0c0d12",
            color: "#fff",
          });
          setActiveView("home");
        }
      } catch (err: any) {
        let msg = err?.message || "เกิดข้อผิดพลาดในการทำรายการ";
        if (msg.includes("already registered"))
          msg = "ชื่อผู้ใช้ หรือ อีเมลนี้ถูกใช้งานในระบบแล้ว";
        if (msg.includes("Invalid login credentials"))
          msg = "ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง";
        if (
          msg.includes("invalid email format") ||
          msg.includes("validation failed")
        )
          msg = "รูปแบบอีเมลหรือข้อมูลไม่ถูกต้อง";
        if (msg.includes("Email not confirmed"))
          msg = "โปรดยืนยันอีเมลของคุณก่อนเข้าสู่ระบบ";
        if (msg.includes("Load failed") || msg.includes("Failed to fetch"))
          msg = "การเชื่อมต่อระบบล้มเหลว กรุณาลองใหม่อีกครั้ง";
        if (msg.includes("Password should be at least"))
          msg = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
        if (msg.toLowerCase().includes("api key"))
          msg = "ระบบยังไม่พร้อมให้บริการ กรุณาติดต่อผู้ดูแล";

        Swal.fire({
          icon: "error",
          title: "ไม่สามารถดำเนินการได้",
          text: msg,
          background: "#0c0d12",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
        });
      } finally {
        setAuthLoading(false);
      }
    };

    return (
      <div className="min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center p-4 sm:p-6 relative bg-[#09090b] text-zinc-100">
        {/* Subtle geometric dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top return bar */}
        <div className="w-full max-w-[420px] mb-3 flex items-center justify-between z-10">
          <button
            type="button"
            onClick={() => setActiveView("home")}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-xl hover:bg-white/[0.04]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่หน้าแรก</span>
          </button>
        </div>

        {/* Auth Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-[420px] bg-[#0c0d12]/95 border border-white/[0.08] relative z-10 rounded-[28px] p-7 sm:p-9 shadow-2xl shadow-black/80 backdrop-blur-xl"
        >
          {/* Brand Header: Circular Emblem + Brand Name */}
          <div
            onClick={() => setActiveView("home")}
            className="flex items-center gap-2.5 justify-center mb-6 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-black via-zinc-950 to-blue-950/50 border border-white/20 flex items-center justify-center shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-blue-500/15 blur-sm rounded-full" />
              {/* Modern 4-point star / diamond icon matching screenshot */}
              <svg
                className="w-4 h-4 text-blue-400 relative z-10 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-widest text-white uppercase">
              {siteName}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* ========================================================= */}
            {/* MODE: LOGIN                                              */}
            {/* ========================================================= */}
            {authMode === "login" && (
              <motion.div
                key="login-mode"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {/* Title & Subtitle */}
                <div className="text-center mb-7">
                  <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight mb-1">
                    เพื่อใช้งาน
                  </h1>
                  <p className="text-sm font-medium text-zinc-300">
                    ลงชื่อเข้าใช้ {siteName}
                  </p>
                </div>

                {/* STEP 1: Enter Username */}
                {loginStep === 1 && (
                  <form onSubmit={handleStep1Next} className="space-y-4">
                    {/* Username Input with right arrow inside */}
                    <div className="relative">
                      <input
                        ref={usernameInputRef}
                        type="text"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        placeholder="ชื่อผู้ใช้"
                        className="w-full h-13 pl-4 pr-13 bg-[#11131a] border border-white/[0.14] focus:border-white/40 focus:bg-[#141722] rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                        autoComplete="username"
                        required
                      />
                      <button
                        type="submit"
                        title="ถัดไป"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.16] active:scale-95 text-zinc-300 hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Navigation Links below */}
                    <div className="pt-2 space-y-2 text-left">
                      <button
                        type="button"
                        onClick={() => setAuthMode("forgot")}
                        className="text-[13px] text-[#6B94FA] hover:text-[#8cb0ff] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>ลืมรหัสผ่านหรือไม่?</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("signup");
                          setLoginStep(1);
                        }}
                        className="text-[13px] text-[#6B94FA] hover:text-[#8cb0ff] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>ไม่มีบัญชี {siteName} ใช่ไหม? สร้างบัญชี {siteName} ของคุณ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: Enter Password */}
                {loginStep === 2 && (
                  <form onSubmit={handleAuth} className="space-y-3.5">
                    {/* Username Display Row with 'แก้ไข' Button */}
                    <div className="flex items-end justify-between px-1">
                      <div>
                        <div className="text-xs text-zinc-400 mb-0.5">
                          ชื่อผู้ใช้
                        </div>
                        <div className="text-sm font-semibold text-white tracking-wide">
                          '{authUsername}'
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginStep(1);
                        }}
                        className="text-xs text-[#6B94FA] hover:text-[#8cb0ff] font-medium cursor-pointer transition-colors"
                      >
                        แก้ไข
                      </button>
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <input
                        ref={passwordInputRef}
                        type={showPassword ? "text" : "password"}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="รหัสผ่าน"
                        className="w-full h-13 pl-4 pr-12 bg-[#11131a] border border-white/[0.14] focus:border-white/40 focus:bg-[#141722] rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                        autoComplete="current-password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Remember me checkbox */}
                    <div className="flex items-center gap-2 pt-0.5 px-0.5">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-300 hover:text-white">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-white/20 bg-[#11131a] text-blue-500 focus:ring-0 cursor-pointer accent-[#6B94FA]"
                        />
                        <span>จดจำฉัน</span>
                      </label>
                    </div>

                    {/* Turnstile Widget */}
                    {TURNSTILE_SITE_KEY && (
                      <div className="w-full flex items-center justify-center py-1">
                        <div className="rounded-2xl overflow-hidden flex items-center justify-center transform scale-[0.85] origin-center">
                          <Turnstile
                            siteKey={TURNSTILE_SITE_KEY}
                            options={{ theme: "dark", size: "normal" }}
                            onSuccess={(token) => setTurnstileToken(token)}
                            onExpire={() => setTurnstileToken(null)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Soft Blue Submit Button */}
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full h-12 mt-2 rounded-2xl bg-[#6B94FA] hover:bg-[#5a86f5] active:scale-[0.99] text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/20"
                    >
                      {authLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>กำลังตรวจสอบ...</span>
                        </>
                      ) : (
                        <span>ลงชื่อเข้าใช้</span>
                      )}
                    </button>

                    {/* Navigation Links below */}
                    <div className="pt-2 space-y-2 text-left">
                      <button
                        type="button"
                        onClick={() => setAuthMode("forgot")}
                        className="text-[13px] text-[#6B94FA] hover:text-[#8cb0ff] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>ลืมรหัสผ่านหรือไม่?</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("signup");
                          setLoginStep(1);
                        }}
                        className="text-[13px] text-[#6B94FA] hover:text-[#8cb0ff] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>ไม่มีบัญชี {siteName} ใช่ไหม? สร้างบัญชี {siteName} ของคุณ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* MODE: SIGNUP                                             */}
            {/* ========================================================= */}
            {authMode === "signup" && (
              <motion.div
                key="signup-mode"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {/* Title & Subtitle */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight mb-1">
                    สร้างบัญชี {siteName} ของคุณ
                  </h1>
                  <p className="text-sm font-medium text-zinc-300">
                    สมัครสมาชิกเพื่อเริ่มใช้งาน
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-3.5">
                  {/* Field 1: ชื่อผู้ใช้ */}
                  <div>
                    <input
                      type="text"
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      placeholder="ชื่อผู้ใช้"
                      className="w-full h-12.5 pl-4 pr-4 bg-[#11131a] border border-white/[0.14] focus:border-white/40 focus:bg-[#141722] rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                      autoComplete="username"
                      required
                    />
                  </div>

                  {/* Field 2: อีเมล */}
                  <div>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="อีเมล"
                      className="w-full h-12.5 pl-4 pr-4 bg-[#11131a] border border-white/[0.14] focus:border-white/40 focus:bg-[#141722] rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                      autoComplete="email"
                      required
                    />
                  </div>

                  {/* Field 3: รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) */}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                      className="w-full h-12.5 pl-4 pr-11 bg-[#11131a] border border-white/[0.14] focus:border-white/40 focus:bg-[#141722] rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                      autoComplete="new-password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Field 4: ยืนยันรหัสผ่าน */}
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={authConfirmPassword}
                      onChange={(e) => setAuthConfirmPassword(e.target.value)}
                      placeholder="ยืนยันรหัสผ่าน"
                      className="w-full h-12.5 pl-4 pr-11 bg-[#11131a] border border-white/[0.14] focus:border-white/40 focus:bg-[#141722] rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                      autoComplete="new-password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Turnstile Widget */}
                  {TURNSTILE_SITE_KEY && (
                    <div className="w-full flex items-center justify-center py-1">
                      <div className="rounded-2xl overflow-hidden flex items-center justify-center transform scale-[0.85] origin-center">
                        <Turnstile
                          siteKey={TURNSTILE_SITE_KEY}
                          options={{ theme: "dark", size: "normal" }}
                          onSuccess={(token) => setTurnstileToken(token)}
                          onExpire={() => setTurnstileToken(null)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Soft Blue Submit Button */}
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full h-12 mt-1 rounded-2xl bg-[#6B94FA] hover:bg-[#5a86f5] active:scale-[0.99] text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/20"
                  >
                    {authLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>กำลังดำเนินการ...</span>
                      </>
                    ) : (
                      <span>สร้างบัญชี</span>
                    )}
                  </button>

                  {/* Bottom Link: มีบัญชีแล้ว? */}
                  <div className="pt-2 text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setLoginStep(1);
                      }}
                      className="text-[13px] text-[#6B94FA] hover:text-[#8cb0ff] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>มีบัญชี {siteName} อยู่แล้ว? ลงชื่อเข้าใช้</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* MODE: FORGOT PASSWORD                                    */}
            {/* ========================================================= */}
            {authMode === "forgot" && (
              <motion.div
                key="forgot-mode"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {/* Title & Subtitle */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight mb-1">
                    รีเซ็ตรหัสผ่าน
                  </h1>
                  <p className="text-sm font-medium text-zinc-300">
                    กู้คืนบัญชี {siteName} ของคุณ
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-3.5">
                  {/* Username */}
                  <div>
                    <input
                      type="text"
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      placeholder="ชื่อผู้ใช้"
                      className="w-full h-12.5 pl-4 pr-4 bg-[#11131a] border border-white/[0.14] focus:border-white/40 focus:bg-[#141722] rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                      autoComplete="username"
                      required
                    />
                  </div>

                  {/* Recovery Email */}
                  <div>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="อีเมลสำหรับกู้คืน"
                      className="w-full h-12.5 pl-4 pr-4 bg-[#11131a] border border-white/[0.14] focus:border-white/40 focus:bg-[#141722] rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                      autoComplete="email"
                      required
                    />
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                      className="w-full h-12.5 pl-4 pr-11 bg-[#11131a] border border-white/[0.14] focus:border-white/40 focus:bg-[#141722] rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                      autoComplete="new-password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Confirm New Password */}
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={authConfirmPassword}
                      onChange={(e) => setAuthConfirmPassword(e.target.value)}
                      placeholder="ยืนยันรหัสผ่านใหม่"
                      className="w-full h-12.5 pl-4 pr-11 bg-[#11131a] border border-white/[0.14] focus:border-white/40 focus:bg-[#141722] rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                      autoComplete="new-password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Turnstile Widget */}
                  {TURNSTILE_SITE_KEY && (
                    <div className="w-full flex items-center justify-center py-1">
                      <div className="rounded-2xl overflow-hidden flex items-center justify-center transform scale-[0.85] origin-center">
                        <Turnstile
                          siteKey={TURNSTILE_SITE_KEY}
                          options={{ theme: "dark", size: "normal" }}
                          onSuccess={(token) => setTurnstileToken(token)}
                          onExpire={() => setTurnstileToken(null)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Soft Blue Submit Button */}
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full h-12 mt-1 rounded-2xl bg-[#6B94FA] hover:bg-[#5a86f5] active:scale-[0.99] text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/20"
                  >
                    {authLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>กำลังดำเนินการ...</span>
                      </>
                    ) : (
                      <span>ตั้งรหัสผ่านใหม่</span>
                    )}
                  </button>

                  {/* Return to Login */}
                  <div className="pt-2 text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setLoginStep(1);
                      }}
                      className="text-[13px] text-[#6B94FA] hover:text-[#8cb0ff] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>ย้อนกลับไปลงชื่อเข้าใช้</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }
);
