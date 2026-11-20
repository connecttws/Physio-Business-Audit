"use client";

import React from "react";
import {
  PatientDetails,
  TRACK_DATA,
  UNIVERSAL_QUESTIONS,
  ClinicalTrack,
} from "@/lib/physio-data";
import {
  User,
  Phone,
  Briefcase,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

interface ClinicalQuestionnaireProps {
  patient: PatientDetails;
  onPatientChange: (fields: Partial<PatientDetails>) => void;
  selectedTrack: string;
  onSelectTrack: (trackKey: string) => void;
  redFlag: "safe" | "alert" | "";
  onRedFlagChange: (val: "safe" | "alert") => void;
  pastHistory: "pills_heat" | "short_physio" | "first_time" | "";
  onPastHistoryChange: (val: "pills_heat" | "short_physio" | "first_time") => void;
  answers: Record<string, number>;
  onAnswer: (questionId: string, optionIndex: number) => void;
  onGenerateReport: () => void;
  onResetForm?: () => void;
  currentScore: number;
}

export function ClinicalQuestionnaire({
  patient,
  onPatientChange,
  selectedTrack,
  onSelectTrack,
  redFlag,
  onRedFlagChange,
  pastHistory,
  onPastHistoryChange,
  answers,
  onAnswer,
  onGenerateReport,
  onResetForm,
  currentScore,
}: ClinicalQuestionnaireProps) {
  const currentTrackData: ClinicalTrack =
    TRACK_DATA[selectedTrack] || TRACK_DATA.lumbar;

  const tracksList = Object.values(TRACK_DATA);

  // Check how many of the 6 track questions have been answered
  const answeredTrackCount = currentTrackData.questions.filter(
    (q) => answers[q.id] !== undefined
  ).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Clinical Intake & Patient Details Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-teal-500/30">
              Step 1 · Intake Profile
            </span>
            {onResetForm && (
              <button
                type="button"
                onClick={onResetForm}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                title="Clear all fields and restart intake"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Patient Demographics & Clinical Intake
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fill in patient details to personalize the biomechanical report and generate a WhatsApp dispatch.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={patient.name}
                  onChange={(e) => onPatientChange({ name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 text-sm transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                WhatsApp Number <span className="text-slate-500 text-[10px] lowercase">(for dispatch)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={patient.whatsappNumber || patient.phone || ""}
                  onChange={(e) =>
                    onPatientChange({
                      whatsappNumber: e.target.value,
                      phone: e.target.value,
                    })
                  }
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 text-sm transition-colors placeholder:text-slate-600 font-mono"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Age
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={patient.age || ""}
                  onChange={(e) => onPatientChange({ age: e.target.value })}
                  placeholder="e.g. 34"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 text-sm transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Daily Occupation / Workstyle */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Daily Occupation & Workstyle
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={patient.occupation || ""}
                  onChange={(e) => onPatientChange({ occupation: e.target.value })}
                  placeholder="e.g. Software Engineer (8 hrs desk sitting)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 text-sm transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Clinical Track Selector */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-teal-500/30">
              Step 2 · Primary Injury Track
            </span>
            <h3 className="text-lg font-black text-white mt-1">
              Select Primary Pain & Movement Focus
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            7 Clinical Specialties
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {tracksList.map((track) => {
            const isSelected = track.id === selectedTrack;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => onSelectTrack(track.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-teal-950/70 border-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.25)] ring-1 ring-teal-400/50"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                    isSelected
                      ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    6 Checks
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  )}
                </div>
                <h4 className="text-xs font-bold leading-tight">
                  {track.badge}
                </h4>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Universal Safety & Red Flag Screen */}
      <section className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <div>
            <h3 className="text-base font-black text-white">
              Universal Safety & Past Treatment Screen
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated across all clinical patients to safeguard neurological integrity
            </p>
          </div>
        </div>

        {/* Universal Question 1: Red Flag */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {UNIVERSAL_QUESTIONS[0].title}
            </h4>
            {redFlag === "alert" && (
              <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
                ⚠️ Medical Flag Active
              </span>
            )}
            {redFlag === "safe" && (
              <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                ✓ Safe for Rehab
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {UNIVERSAL_QUESTIONS[0].description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {UNIVERSAL_QUESTIONS[0].options.map((opt) => {
              const isSelected = redFlag === opt.value;
              return (
                <label
                  key={opt.value}
                  onClick={() => onRedFlagChange(opt.value as "safe" | "alert")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between text-xs ${
                    isSelected
                      ? opt.isAlert
                        ? "bg-red-950/60 border-red-500 text-red-200 ring-1 ring-red-500/40"
                        : "bg-teal-950/60 border-teal-500 text-teal-200 ring-1 ring-teal-500/40"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>{opt.label}</span>
                    <input
                      type="radio"
                      name="u_redflag"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => onRedFlagChange(opt.value as "safe" | "alert")}
                      className="accent-teal-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {opt.subtext}
                  </p>
                </label>
              );
            })}
          </div>
        </div>

        {/* Universal Question 2: Past History */}
        <div className="space-y-2.5 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {UNIVERSAL_QUESTIONS[1].title}
          </h4>
          <p className="text-xs text-slate-400">
            {UNIVERSAL_QUESTIONS[1].description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {UNIVERSAL_QUESTIONS[1].options.map((opt) => {
              const isSelected = pastHistory === opt.value;
              return (
                <label
                  key={opt.value}
                  onClick={() =>
                    onPastHistoryChange(
                      opt.value as "pills_heat" | "short_physio" | "first_time"
                    )
                  }
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between text-xs ${
                    isSelected
                      ? "bg-teal-950/60 border-teal-500 text-teal-200 ring-1 ring-teal-500/40"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>{opt.label}</span>
                    <input
                      type="radio"
                      name="u_past"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() =>
                        onPastHistoryChange(
                          opt.value as "pills_heat" | "short_physio" | "first_time"
                        )
                      }
                      className="accent-teal-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {opt.subtext}
                  </p>
                </label>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. 6 Targeted Track Diagnostic Questions */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-teal-400 tracking-wider">
              Clinical Biomechanical Screen
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              {currentTrackData.title}
            </h3>
          </div>
          <span className="px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold rounded-xl uppercase">
            {answeredTrackCount}/6 Checks
          </span>
        </div>

        <div className="space-y-6">
          {currentTrackData.questions.map((q, qIdx) => {
            const selectedOptIdx = answers[q.id];
            const isAnswered = selectedOptIdx !== undefined;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isAnswered
                    ? "bg-slate-950/70 border-slate-800/80"
                    : "bg-slate-950/40 border-slate-800/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>{q.label}</span>
                    {isAnswered && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 inline" />
                    )}
                  </h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                    isAnswered
                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                      : "text-slate-500"
                  }`}>
                    {isAnswered ? "Answered" : `Check ${qIdx + 1}`}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
                  {q.sub}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isChecked = selectedOptIdx !== undefined && selectedOptIdx === oIdx;

                    return (
                      <label
                        key={oIdx}
                        onClick={() => onAnswer(q.id, oIdx)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all text-xs leading-relaxed ${
                          isChecked
                            ? opt.flag
                              ? "bg-red-950/40 border-red-500/50 text-red-200 shadow-sm ring-1 ring-red-500/30"
                              : "bg-teal-950/40 border-teal-500/50 text-teal-200 shadow-sm ring-1 ring-teal-500/30"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={isChecked}
                          onChange={() => onAnswer(q.id, oIdx)}
                          className="mt-0.5 accent-teal-500 shrink-0"
                        />
                        <div className="flex-1">
                          <span className="block font-medium">{opt.text}</span>
                          {opt.flag && isChecked && (
                            <span className="inline-block mt-1 text-[11px] font-mono font-semibold text-red-400">
                              ⚠️ Diagnostic Flag: {opt.flag}
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Sticky Bottom Action Bar */}
      <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-mono font-black text-sm">
            {answeredTrackCount > 0 ? currentScore : "—"}
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {answeredTrackCount > 0
                ? `Kinetic Dysfunction Score: ${currentScore}/100`
                : "Awaiting Diagnostic Answers"}
            </div>
            <div className="text-[11px] text-slate-400">
              {answeredTrackCount === 6
                ? "All 6 checks completed · Ready for Report"
                : `${answeredTrackCount} of 6 checks completed`}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onGenerateReport}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(20,184,166,0.3)] transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <span>Analyze Biomechanics & Generate Clinical Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
