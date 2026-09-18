import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  ChevronRight,
  ShieldCheck,
  X,
  Lock,
  User,
  Mail,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "motion/react";
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

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

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
    const [showTurnstileModal, setShowTurnstileModal] = useState(false);

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

      if (TURNSTILE_SITE_KEY && !turnstileToken) {
        setShowTurnstileModal(true);
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
      <div className="min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center p-4 sm:p-8 relative text-zinc-100 overflow-hidden">
        {/* Animated Background Ambience */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 15, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.12, 0.22, 0.12],
            x: [0, -20, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"
        />

        {/* Subtle geometric dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Auth Main Area with Glass Card Glow */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px] relative z-10 px-4 py-8 sm:p-9 bg-zinc-950/70 border border-white/[0.08] rounded-3xl backdrop-blur-xl shadow-2xl shadow-black/60"
        >
          {/* Animated Brand Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center justify-center mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{siteName} SECURE ACCESS</span>
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ========================================================= */}
            {/* MODE: LOGIN                                              */}
            {/* ========================================================= */}
            {authMode === "login" && (
              <motion.div
                key={`login-mode-step-${loginStep}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Title & Subtitle */}
                <motion.div variants={itemVariants} className="text-center mb-7">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                    {loginStep === 1 ? "ยินดีต้อนรับกลับมา" : "ป้อนรหัสผ่านของคุณ"}
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-zinc-400">
                    {loginStep === 1
                      ? `ลงชื่อเข้าใช้ระบบ ${siteName} เพื่อดำเนินการต่อ`
                      : `ยืนยันการเข้าใช้งานบัญชี ${authUsername}`}
                  </p>
                </motion.div>

                {/* STEP 1: Enter Username */}
                {loginStep === 1 && (
                  <form onSubmit={handleStep1Next} className="space-y-4">
                    {/* Username Input with Animated Glow */}
                    <motion.div variants={itemVariants} className="space-y-1.5">
                      <label className="block text-xs font-medium text-zinc-300 ml-1">
                        ชื่อผู้ใช้ (Username)
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          ref={usernameInputRef}
                          type="text"
                          value={authUsername}
                          onChange={(e) => setAuthUsername(e.target.value)}
                          placeholder="กรอกชื่อผู้ใช้ของคุณ"
                          className="w-full h-13 pl-11 pr-13 bg-[#11131a] border border-white/[0.14] focus:border-blue-500/80 focus:bg-[#141722] focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                          autoComplete="username"
                          required
                        />
                        <motion.button
                          type="submit"
                          title="ถัดไป"
                          whileHover={{ scale: 1.08, x: 2 }}
                          whileTap={{ scale: 0.92 }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-md shadow-blue-500/30"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Navigation Links below */}
                    <motion.div variants={itemVariants} className="pt-3 space-y-2 text-left border-t border-white/[0.06]">
                      <motion.button
                        type="button"
                        whileHover={{ x: 3 }}
                        onClick={() => setAuthMode("forgot")}
                        className="text-xs text-[#6B94FA] hover:text-[#8cb0ff] font-medium transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>ลืมรหัสผ่านหรือไม่?</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ x: 3 }}
                        onClick={() => {
                          setAuthMode("signup");
                          setLoginStep(1);
                        }}
                        className="text-xs text-[#6B94FA] hover:text-[#8cb0ff] font-medium transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>ยังไม่มีบัญชี {siteName}? สร้างบัญชีใหม่</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.div>
                  </form>
                )}

                {/* STEP 2: Enter Password */}
                {loginStep === 2 && (
                  <form onSubmit={handleAuth} className="space-y-4">
                    {/* Username Display Row with 'แก้ไข' Button */}
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                          {authUsername.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-400 leading-none">
                            ผู้ใช้งาน
                          </div>
                          <div className="text-xs font-semibold text-white tracking-wide mt-0.5">
                            {authUsername}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLoginStep(1)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/[0.05]"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>แก้ไข</span>
                      </button>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div variants={itemVariants} className="space-y-1.5">
                      <label className="block text-xs font-medium text-zinc-300 ml-1">
                        รหัสผ่าน (Password)
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          ref={passwordInputRef}
                          type={showPassword ? "text" : "password"}
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="กรอกรหัสผ่านของคุณ"
                          className="w-full h-13 pl-11 pr-12 bg-[#11131a] border border-white/[0.14] focus:border-blue-500/80 focus:bg-[#141722] focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                          autoComplete="current-password"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </motion.div>

                    {/* Remember me checkbox */}
                    <motion.div variants={itemVariants} className="flex items-center gap-2 pt-0.5 px-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-300 hover:text-white">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-white/20 bg-[#11131a] text-blue-500 focus:ring-0 cursor-pointer accent-[#6B94FA]"
                        />
                        <span>จดจำการเข้าสู่ระบบ</span>
                      </label>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants}>
                      <motion.button
                        type="submit"
                        disabled={authLoading}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-500/25"
                      >
                        {authLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>กำลังตรวจสอบข้อมูล...</span>
                          </>
                        ) : (
                          <span>เข้าสู่ระบบ</span>
                        )}
                      </motion.button>
                    </motion.div>

                    {/* Navigation Links below */}
                    <motion.div variants={itemVariants} className="pt-3 space-y-2 text-left border-t border-white/[0.06]">
                      <motion.button
                        type="button"
                        whileHover={{ x: 3 }}
                        onClick={() => setAuthMode("forgot")}
                        className="text-xs text-[#6B94FA] hover:text-[#8cb0ff] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>ลืมรหัสผ่านหรือไม่?</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ x: 3 }}
                        onClick={() => {
                          setAuthMode("signup");
                          setLoginStep(1);
                        }}
                        className="text-xs text-[#6B94FA] hover:text-[#8cb0ff] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>ยังไม่มีบัญชี {siteName}? สร้างบัญชีใหม่</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.div>
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
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Title & Subtitle */}
                <motion.div variants={itemVariants} className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                    สร้างบัญชี {siteName}
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-zinc-400">
                    กรอกข้อมูลด้านล่างเพื่อเริ่มใช้งานระบบ
                  </p>
                </motion.div>

                <form onSubmit={handleAuth} className="space-y-3.5">
                  {/* Field 1: ชื่อผู้ใช้ */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-300 ml-1">
                      ชื่อผู้ใช้ (Username)
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        placeholder="ตั้งชื่อผู้ใช้ของคุณ"
                        className="w-full h-12 pl-11 pr-4 bg-[#11131a] border border-white/[0.14] focus:border-blue-500/80 focus:bg-[#141722] focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Field 2: อีเมล */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-300 ml-1">
                      อีเมล (Email)
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="example@domain.com"
                        className="w-full h-12 pl-11 pr-4 bg-[#11131a] border border-white/[0.14] focus:border-blue-500/80 focus:bg-[#141722] focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Field 3: รหัสผ่าน */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-300 ml-1">
                      รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 pl-11 pr-11 bg-[#11131a] border border-white/[0.14] focus:border-blue-500/80 focus:bg-[#141722] focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Field 4: ยืนยันรหัสผ่าน */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-300 ml-1">
                      ยืนยันรหัสผ่าน
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={authConfirmPassword}
                        onChange={(e) => setAuthConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 pl-11 pr-11 bg-[#11131a] border border-white/[0.14] focus:border-blue-500/80 focus:bg-[#141722] focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants} className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={authLoading}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-500/25"
                    >
                      {authLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>กำลังบันทึกข้อมูล...</span>
                        </>
                      ) : (
                        <span>สร้างบัญชีผู้ใช้</span>
                      )}
                    </motion.button>
                  </motion.div>

                  {/* Bottom Link */}
                  <motion.div variants={itemVariants} className="pt-3 text-left border-t border-white/[0.06]">
                    <motion.button
                      type="button"
                      whileHover={{ x: 3 }}
                      onClick={() => {
                        setAuthMode("login");
                        setLoginStep(1);
                      }}
                      className="text-xs text-[#6B94FA] hover:text-[#8cb0ff] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>มีบัญชี {siteName} อยู่แล้ว? ลงชื่อเข้าใช้</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* MODE: FORGOT PASSWORD                                    */}
            {/* ========================================================= */}
            {authMode === "forgot" && (
              <motion.div
                key="forgot-mode"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Title & Subtitle */}
                <motion.div variants={itemVariants} className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                    รีเซ็ตรหัสผ่าน
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-zinc-400">
                    กู้คืนและตั้งค่ารหัสผ่านใหม่สำหรับบัญชี {siteName}
                  </p>
                </motion.div>

                <form onSubmit={handleAuth} className="space-y-3.5">
                  {/* Username */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-300 ml-1">
                      ชื่อผู้ใช้ (Username)
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        placeholder="ชื่อผู้ใช้ของคุณ"
                        className="w-full h-12 pl-11 pr-4 bg-[#11131a] border border-white/[0.14] focus:border-blue-500/80 focus:bg-[#141722] focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Recovery Email */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-300 ml-1">
                      อีเมลที่ใช้สมัคร (Recovery Email)
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="example@domain.com"
                        className="w-full h-12 pl-11 pr-4 bg-[#11131a] border border-white/[0.14] focus:border-blue-500/80 focus:bg-[#141722] focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* New Password */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-300 ml-1">
                      รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 pl-11 pr-11 bg-[#11131a] border border-white/[0.14] focus:border-blue-500/80 focus:bg-[#141722] focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Confirm New Password */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-300 ml-1">
                      ยืนยันรหัสผ่านใหม่
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={authConfirmPassword}
                        onChange={(e) => setAuthConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 pl-11 pr-11 bg-[#11131a] border border-white/[0.14] focus:border-blue-500/80 focus:bg-[#141722] focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-200"
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants} className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={authLoading}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-500/25"
                    >
                      {authLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>กำลังดำเนินการ...</span>
                        </>
                      ) : (
                        <span>ตั้งรหัสผ่านใหม่</span>
                      )}
                    </motion.button>
                  </motion.div>

                  {/* Return to Login */}
                  <motion.div variants={itemVariants} className="pt-3 text-left border-t border-white/[0.06]">
                    <motion.button
                      type="button"
                      whileHover={{ x: 3 }}
                      onClick={() => {
                        setAuthMode("login");
                        setLoginStep(1);
                      }}
                      className="text-xs text-[#6B94FA] hover:text-[#8cb0ff] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>ย้อนกลับไปลงชื่อเข้าใช้</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Cloudflare Turnstile Verification Popup Modal */}
        <AnimatePresence>
          {showTurnstileModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-sm bg-[#0e1017] border border-white/10 rounded-3xl p-6 shadow-2xl relative text-center"
              >
                <button
                  type="button"
                  onClick={() => setShowTurnstileModal(false)}
                  className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  การตรวจสอบความปลอดภัย
                </h3>
                <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                  โปรดยืนยันว่าคุณไม่ใช่โปรแกรมอัตโนมัติ เพื่อดำเนินการต่อ
                </p>

                <div className="flex items-center justify-center py-2 min-h-[70px]">
                  {TURNSTILE_SITE_KEY && (
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      options={{ theme: "dark", size: "normal" }}
                      onSuccess={(token) => {
                        setTurnstileToken(token);
                        setShowTurnstileModal(false);
                        executeAuth(token);
                      }}
                      onExpire={() => setTurnstileToken(null)}
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowTurnstileModal(false)}
                  className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
