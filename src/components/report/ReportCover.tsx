"use client";

import React from "react";
import { AlertTriangle, ShieldCheck, Activity, User, Calendar, Briefcase } from "lucide-react";
import { PhysioAuditRecord } from "@/lib/physio-data";

interface ReportCoverProps {
  record: PhysioAuditRecord;
}

export function ReportCover({ record }: ReportCoverProps) {
  const getStatusColor = (level: string) => {
    if (level === "optimal") return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (level === "moderate") return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-red-400 border-red-500/30 bg-red-500/10";
  };

  const statusTheme = getStatusColor(record.status.level);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl print-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-teal-400 tracking-wider">
            KineticFix Clinical Rehabilitation Report
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {record.patient.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5 font-medium">
            {record.patient.age && <span>Age: {record.patient.age}</span>}
            {record.patient.occupation && (
              <>
                <span>·</span>
                <span>{record.patient.occupation}</span>
              </>
            )}
            <span>·</span>
            <span>Assessed on {record.patient.date || "Today"}</span>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
            Primary Assessment Track
          </div>
          <div className="inline-block mt-1 px-3.5 py-1.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl font-bold text-xs uppercase tracking-wide">
            {record.trackBadge}
          </div>
        </div>
      </div>

      {/* Score Wheel & Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Score Wheel */}
        <div className="text-center p-6 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider mb-2">
            Kinetic Dysfunction Score
          </div>
          <div className="text-5xl font-black font-mono text-teal-400 mb-1">
            {record.totalScore}
            <span className="text-xl text-slate-500 font-normal">/100</span>
          </div>
          <div className={`inline-block mt-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase tracking-wide ${statusTheme}`}>
            {record.status.title}
          </div>
        </div>

        {/* Clinical Summary & Red Flag Alert */}
        <div className="md:col-span-2 space-y-3">
          <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Clinical Biomechanical Summary
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {record.status.summary}
          </p>

          {record.redFlag === "alert" && (
            <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300 font-medium flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong>Medical Alert:</strong> Neurological and radiating signs detected during screen. Requires physician / orthopedist co-evaluation alongside structured active rehabilitation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
