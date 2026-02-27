import { Leaf, LogIn, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { guestRateLimitService } from "../services/guestRateLimitService";

interface GuestLimitBannerProps {
  theme: "dark" | "light";
  onLoginClick: () => void;
  refreshKey?: number;
}

function GuestLimitBanner({
  theme,
  onLoginClick,
  refreshKey,
}: GuestLimitBannerProps) {
  const [stats, setStats] = useState(guestRateLimitService.getUsageStats());

  // Refresh stats every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(guestRateLimitService.getUsageStats());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Refresh stats when component mounts or refreshKey changes
  useEffect(() => {
    setStats(guestRateLimitService.getUsageStats());
  }, [refreshKey]);

  const isDark = theme === "dark";

  // Show gentle pause message when limit is reached
  if (stats.isLimitReached) {
    return (
      <div
        className={`mx-auto mb-4 max-w-4xl rounded-2xl border px-5 py-4 ${
          isDark
            ? "border-emerald-800/40 bg-emerald-950/30"
            : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <Leaf
              className={`h-6 w-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
            />
          </div>
          <div>
            <p
              className={`text-sm leading-relaxed ${isDark ? "text-emerald-200" : "text-emerald-800"}`}
            >
              Let's take a gentle pause 🌱 You can continue in{" "}
              <strong>{stats.timeUntilReset || "a few hours"}</strong>, or log
              in to keep reflecting.
            </p>
            <p
              className={`mt-1 text-xs ${isDark ? "text-emerald-400/70" : "text-emerald-600/70"}`}
            >
              Taking breaks can be part of the journey too.
            </p>
          </div>
          <button
            onClick={onLoginClick}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              isDark
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            <LogIn className="h-4 w-4" />
            Sign in to continue
          </button>
        </div>
      </div>
    );
  }

  // Show gentle reminder when running low (2 or fewer messages left)
  if (stats.isRunningLow) {
    return (
      <div
        className={`mx-auto mb-4 max-w-4xl rounded-2xl border px-5 py-4 ${
          isDark
            ? "border-amber-800/30 bg-amber-950/20"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <Sparkles
              className={`h-5 w-5 shrink-0 ${isDark ? "text-amber-400" : "text-amber-600"}`}
            />
            <p
              className={`text-sm ${isDark ? "text-amber-200" : "text-amber-800"}`}
            >
              You have <strong>{stats.remaining}</strong> reflection
              {stats.remaining === 1 ? "" : "s"} left as a guest 💫
            </p>
          </div>
          <button
            onClick={onLoginClick}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              isDark
                ? "text-amber-400 hover:text-amber-300"
                : "text-amber-700 hover:text-amber-800"
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            Sign in for unlimited
          </button>
        </div>
      </div>
    );
  }

  // Show subtle info when messages are still available
  return (
    <div
      className={`mx-auto mb-4 max-w-4xl rounded-xl border px-4 py-3 ${
        isDark ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2 text-sm">
          <Leaf
            className={`h-4 w-4 shrink-0 ${isDark ? "text-emerald-500" : "text-emerald-600"}`}
          />
          <span className={isDark ? "text-gray-400" : "text-gray-600"}>
            <strong className={isDark ? "text-gray-200" : "text-gray-700"}>
              {stats.remaining}
            </strong>{" "}
            of {stats.total} guest reflections available
          </span>
        </div>
        <button
          onClick={onLoginClick}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            isDark
              ? "text-gray-500 hover:text-emerald-400"
              : "text-gray-500 hover:text-emerald-600"
          }`}
        >
          <LogIn className="h-3.5 w-3.5" />
          Sign in for more
        </button>
      </div>
    </div>
  );
}

export default GuestLimitBanner;
