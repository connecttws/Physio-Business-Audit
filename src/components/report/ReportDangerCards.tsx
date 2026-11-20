"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";

interface ReportDangerCardsProps {
  flags: string[];
}

export function ReportDangerCards({ flags }: ReportDangerCardsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl print-border flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-teal-400 tracking-wider">
              Diagnostic Pathology Screen
            </span>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
              Core Mechanical Breakdowns Discovered
            </h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
            {flags.length} Flag{flags.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="space-y-3">
          {flags && flags.length > 0 ? (
            flags.map((flag, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-red-200 flex items-start gap-3 shadow-sm"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-xs block font-bold">
                    {flag}
                  </strong>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Identified mechanical dysfunction requiring targeted physical therapy joint mobilization and active stabilizer re-education.
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 text-xs text-teal-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-xs block font-bold">
                  No Acute Biomechanical Shearing Flags
                </strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Joint kinematics are intact. Ready for active endurance and functional maintenance programming.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Clinical Fact: </strong>
          When deep stabilizers fail or shut down from pain, passive joints bear up to 300% more shear load during routine daily movements.
        </div>
      </div>
    </div>
  );
}
