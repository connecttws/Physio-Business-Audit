"use client";

import React from "react";
import { Stethoscope, Quote } from "lucide-react";

interface ReportPhysioScriptProps {
  consultationScript: string;
}

export function ReportPhysioScript({
  consultationScript,
}: ReportPhysioScriptProps) {
  return (
    <div className="bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-950 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-xl print-border relative overflow-hidden">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
          <Stethoscope className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-teal-400 tracking-wider">
            Clinical Recommendation
          </span>
          <h2 className="text-base sm:text-lg font-black text-white">
            Physiotherapist Consultation Summary
          </h2>
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-teal-500/20 relative">
        <Quote className="w-6 h-6 text-teal-500/30 absolute top-4 right-4 pointer-events-none" />
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic whitespace-pre-line font-serif">
          {consultationScript}
        </p>
      </div>
    </div>
  );
}
