"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Share2, Copy, Check, MessageSquare } from "lucide-react";
import { PhysioAuditRecord } from "@/lib/physio-data";
import { encodeAuditForUrl } from "@/lib/audit-storage";

interface ReportHeaderProps {
  record: PhysioAuditRecord;
}

export function ReportHeader({ record }: ReportHeaderProps) {
  const [copied, setCopied] = useState(false);

  const encodedPayload = encodeAuditForUrl(record);
  const reportUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/report?id=${record.id}${encodedPayload ? `&d=${encodedPayload}` : ""}`
      : `/report?id=${record.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Please copy URL from the address bar.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `KineticFix Clinical Assessment for ${record.patient.name} (${record.trackBadge}) - Score: ${record.totalScore}/100. Review report: ${reportUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-6 border-b border-slate-800 no-print">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-teal-400" />
        <span>Back to Clinical Intake</span>
      </Link>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-slate-400" />
          <span>Print / Save PDF</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-teal-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
