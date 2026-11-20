"use client";

import React from "react";
import { RehabPhase } from "@/lib/physio-data";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

interface ReportRehabProtocolProps {
  rehabProtocol: RehabPhase[];
}

export function ReportRehabProtocol({
  rehabProtocol,
}: ReportRehabProtocolProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl print-border">
      <div className="mb-6 pb-4 border-b border-slate-800">
        <span className="text-[10px] uppercase font-mono font-bold text-teal-400 tracking-wider">
          Evidence-Based Care Pathway
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
          Prescribed 3-Phase Clinical Rehabilitation Protocol
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Structured to decompress articular surfaces, activate dormant stabilizers, and build permanent load resilience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {rehabProtocol.map((phase, idx) => {
          const isPhase1 = idx === 0;
          const isPhase2 = idx === 1;

          const headerColor = isPhase1
            ? "text-teal-400 border-teal-500/30 bg-teal-500/10"
            : isPhase2
            ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
            : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";

          const dotColor = isPhase1
            ? "text-teal-400"
            : isPhase2
            ? "text-amber-400"
            : "text-emerald-400";

          return (
            <div
              key={phase.phase}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-750 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border ${headerColor}`}
                  >
                    {phase.phase}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {phase.sessions}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-3">
                  {phase.title}
                </h3>

                <ul className="space-y-2 text-xs text-slate-400">
                  {phase.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${dotColor}`}
                      />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-900 text-[10px] font-mono text-slate-500">
                Milestone: {idx === 0 ? "Pain-Free Arcs" : idx === 1 ? "Symmetrical Control" : "Full Load Resilience"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
