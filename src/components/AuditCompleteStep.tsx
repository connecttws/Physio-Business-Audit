"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  RotateCcw,
  Copy,
  Check,
  Send,
  ShieldCheck,
  Phone,
  User,
  Activity,
  ArrowRight,
  AlertTriangle,
  FileText,
  Share2,
} from "lucide-react";
import {
  PhysioAuditRecord,
  isValidIndianMobile,
  cleanIndianMobile,
  formatWhatsAppUrl,
} from "@/lib/physio-data";
import { saveAuditToStorage } from "@/lib/audit-storage";

interface AuditCompleteStepProps {
  record: PhysioAuditRecord;
  onReviewAnswers: () => void;
  onReset: () => void;
}

export function AuditCompleteStep({
  record,
  onReviewAnswers,
  onReset,
}: AuditCompleteStepProps) {
  const [copied, setCopied] = useState(false);
  const [patientPhone, setPatientPhone] = useState(
    record.patient.whatsappNumber || record.patient.phone || ""
  );
  const [phoneError, setPhoneError] = useState("");
  const [wasSent, setWasSent] = useState(false);

  // Clean short report URL (/r/[id])
  const reportUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${record.id}`
      : `/r/${record.id}`;

  const isPhoneValid = isValidIndianMobile(patientPhone);

  const handlePhoneChange = (val: string) => {
    setPatientPhone(val);
    setPhoneError("");
    setWasSent(false);
    record.patient.whatsappNumber = val;
    record.patient.phone = val;
    saveAuditToStorage(record);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Please copy the URL manually from your address bar.");
    }
  };

  const generateWhatsAppMessage = () => {
    const ageStr = record.patient.age ? ` (Age: ${record.patient.age})` : "";
    const occupationStr = record.patient.occupation
      ? `*Occupation:* ${record.patient.occupation}\n`
      : "";

    return (
      `*KineticFix • Clinical Physiotherapy & Biomechanical Report*\n\n` +
      `*Patient:* ${record.patient.name}${ageStr}\n` +
      `*Assessment Track:* ${record.trackBadge}\n` +
      occupationStr +
      `*Kinetic Dysfunction Score:* ${record.totalScore} / 100\n` +
      `*Clinical Status:* ${record.status.title}\n\n` +
      `*5-Pillar Kinetic Chain Balance:*\n` +
      record.pillars
        .map((p) => `• ${p.name}: ${p.score}% (Target: 95%)`)
        .join("\n") +
      `\n\n` +
      (record.flags.length > 0
        ? `*Core Mechanical Breakdowns Discovered:*\n` +
          record.flags
            .slice(0, 3)
            .map((f) => `⚠️ ${f}`)
            .join("\n") +
          `\n\n`
        : "") +
      `*View Full Diagnostic Report & 3-Phase Rehab Protocol:*\n` +
      `${reportUrl}\n\n` +
      `_Prescribed by KineticFix Physical Therapy & Biomechanical Rehabilitation._`
    );
  };

  const handleSendWhatsApp = () => {
    if (!isPhoneValid) {
      setPhoneError("Please enter a valid 10-digit Indian WhatsApp number.");
      return;
    }

    const text = generateWhatsAppMessage();
    const waUrl = formatWhatsAppUrl(patientPhone, text);
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setWasSent(true);
  };

  const handleShareGeneral = () => {
    const text = `KineticFix Clinical Assessment for ${record.patient.name} (${record.trackBadge}) - Score: ${record.totalScore}/100. Review report: ${reportUrl}`;
    const waUrl = formatWhatsAppUrl("", text);
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. Success Announcement Banner */}
      <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-teal-950/80 via-slate-900 to-slate-950 border border-teal-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold uppercase tracking-wider border border-teal-500/30">
              <Check className="w-3.5 h-3.5 text-teal-400" />
              <span>Diagnostic Synthesis Complete</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Biomechanical Report Generated
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Kinetic chain baseline analyzed for <strong className="text-white">{record.patient.name}</strong> across the <strong className="text-teal-300">{record.trackBadge}</strong> clinical track.
            </p>
          </div>

          {/* Big Score Callout */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0 min-w-[160px]">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
              Kinetic Dysfunction
            </span>
            <div className="text-4xl font-black font-mono text-teal-400 mt-0.5">
              {record.totalScore}
              <span className="text-base text-slate-500 font-normal">/100</span>
            </div>
            <span className="inline-block mt-1 text-[11px] font-bold text-slate-300">
              {record.status.level === "severe"
                ? "Severe Breakdown"
                : record.status.level === "moderate"
                ? "Compensatory Strain"
                : "Optimal Health"}
            </span>
          </div>
        </div>

        {record.redFlag === "alert" && (
          <div className="mt-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong>Medical Alert Triggered:</strong> Neurological red flags detected during intake. Co-evaluation with an orthopedist is recommended alongside targeted manual therapy.
            </div>
          </div>
        )}
      </div>

      {/* 2. Direct WhatsApp Dispatch Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-black text-white">
              Dispatch Diagnostic Report to Patient
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Send the complete interactive report link and 3-phase rehabilitation plan directly to the patient's phone.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Patient WhatsApp Mobile Number
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 text-sm font-mono transition-colors placeholder:text-slate-600"
                />
              </div>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(37,211,102,0.3)] transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 fill-slate-950" />
                <span>Send via WhatsApp</span>
              </button>
            </div>

            {phoneError && (
              <p className="text-xs text-red-400 mt-1.5 font-medium">
                {phoneError}
              </p>
            )}

            {wasSent && (
              <p className="text-xs text-emerald-400 mt-1.5 font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>WhatsApp conversation launched with prefilled report message!</span>
              </p>
            )}
          </div>

          {/* Shareable Link Box */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Permanent Report URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={reportUrl}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 text-slate-300 text-xs rounded-xl border border-slate-800 font-mono truncate focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareGeneral}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                title="Share via WhatsApp"
              >
                <Share2 className="w-4 h-4 text-teal-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link
          href={`/report?id=${record.id}`}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Open Full Diagnostic Report on Screen</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onReviewAnswers}
            className="flex-1 sm:flex-initial px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Review Checks
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex-1 sm:flex-initial px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Patient Intake</span>
          </button>
        </div>
      </div>
    </div>
  );
}
