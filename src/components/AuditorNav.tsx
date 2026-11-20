"use client";

import React from "react";
import Link from "next/link";
import { History, Activity, Share2, Stethoscope, AlertTriangle } from "lucide-react";

interface AuditorNavProps {
  patientName?: string;
  trackBadge?: string;
  currentScore: number;
  maxScore?: number;
  answeredCount: number;
  totalQuestions?: number;
  hasRedFlagAlert?: boolean;
  onOpenHistory?: () => void;
  historyCount?: number;
}

export function AuditorNav({
  patientName,
  trackBadge,
  currentScore,
  maxScore = 100,
  answeredCount,
  totalQuestions = 6,
  hasRedFlagAlert = false,
  onOpenHistory,
  historyCount = 0,
}: AuditorNavProps) {
  // Score color badge
  const getScoreColor = (s: number) => {
    if (s >= 75) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (s >= 45) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-red-400 bg-red-500/10 border-red-500/30";
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 text-white border-b border-slate-800 shadow-xl backdrop-blur-md no-print">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand / Patient Identifier */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 text-slate-950 font-black text-xs tracking-wider shrink-0 shadow-md flex items-center justify-center font-mono"
            title="KineticFix Clinical Screen"
          >
            KF
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2 truncate">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white block truncate">
                KineticFix
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
              <span className="text-xs font-semibold text-teal-400 truncate hidden sm:inline">
                {patientName?.trim() ? patientName : (trackBadge || "Clinical Screen")}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate">
              Biomechanical & Musculoskeletal Audit
            </p>
          </div>
        </div>

        {/* Center/Right: Live Score Indicator & History */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {hasRedFlagAlert && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Red Flag Alert</span>
            </div>
          )}

          {/* Live Score Gauge Pill */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-right">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block leading-none">
                Score
              </span>
              <div className="flex items-baseline gap-0.5 leading-none mt-1">
                <span className={`text-base sm:text-lg font-black font-mono ${getScoreColor(currentScore).split(" ")[0]}`}>
                  {currentScore}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 font-mono">
                  /{maxScore}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            {/* Answer count */}
            <div className="text-right">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block leading-none">
                Checks
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 font-mono leading-none mt-1 block">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* History Button */}
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
              title="Recent Clinical Audits"
            >
              <History className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold hidden md:inline">History</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-teal-500/20 border border-teal-500/30 text-[10px] font-mono font-bold text-teal-300">
                  {historyCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
