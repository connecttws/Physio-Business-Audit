"use client";

import React from "react";
import { MessageSquare, CheckCircle2, ArrowRight, ShieldCheck, Stethoscope } from "lucide-react";
import {
  PhysioAuditRecord,
  CLINIC_SUPPORT_PHONE,
  CLINIC_DISPLAY_PHONE,
} from "@/lib/physio-data";
import { encodeAuditForUrl } from "@/lib/audit-storage";

interface ReportWhatsAppCtaProps {
  record: PhysioAuditRecord;
}

export function ReportWhatsAppCta({ record }: ReportWhatsAppCtaProps) {
  const handleConnectWhatsApp = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const encodedPayload = encodeAuditForUrl(record);
    const reportUrl = `${origin}/report?id=${record.id}${encodedPayload ? `&d=${encodedPayload}` : ""}`;

    const text =
      `Hi KineticFix Clinical Team! I reviewed my Physiotherapy & Biomechanical Report for *${record.patient.name}* (Dysfunction Score: ${record.totalScore}/100, Track: ${record.trackBadge}, Ref: ${record.id}).\n\n` +
      `*My Diagnostic Report:* ${reportUrl}\n\n` +
      `I would like to discuss starting the recommended *3-Phase Rehabilitation Protocol* and schedule my 1-on-1 hands-on clinical evaluation. Please let me know your available slots!`;

    window.open(
      `https://api.whatsapp.com/send?phone=${CLINIC_SUPPORT_PHONE}&text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white p-7 sm:p-10 shadow-2xl border border-teal-500/40 space-y-7 no-print">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-teal-500/20" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 flex-1 text-center lg:text-left">
          {/* Status pill with contact badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold uppercase tracking-wider border border-teal-500/30">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>KineticFix Clinical Line · {CLINIC_DISPLAY_PHONE}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
            Ready to resolve this joint dysfunction with targeted manual therapy?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            KineticFix delivers 1-on-1 clinical physiotherapy, hands-on joint mobilization, deep dry needling, and functional stabilizer retraining to eliminate recurring pain permanently.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> 1-on-1 Clinical Assessment
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Evidence-Based 3-Phase Protocol
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Zero Reliance on Temporary Pills
            </span>
          </div>
        </div>

        {/* Big WhatsApp CTA Button */}
        <div className="shrink-0 w-full sm:w-auto text-center space-y-2">
          <button
            type="button"
            onClick={handleConnectWhatsApp}
            className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1da851] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <MessageSquare className="w-5 h-5 fill-slate-950 text-slate-950" />
            <span>Book Clinical Evaluation ({CLINIC_DISPLAY_PHONE})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>Direct link with patient audit attached</span>
            <span>·</span>
            <span className="text-teal-400 font-bold">Fast Reply</span>
          </div>
        </div>
      </div>
    </div>
  );
}
