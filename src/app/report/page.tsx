"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportCover } from "@/components/report/ReportCover";
import { ReportBreakdown } from "@/components/report/ReportBreakdown";
import { ReportDangerCards } from "@/components/report/ReportDangerCards";
import { ReportRehabProtocol } from "@/components/report/ReportRehabProtocol";
import { ReportPhysioScript } from "@/components/report/ReportPhysioScript";
import { ReportWhatsAppCta } from "@/components/report/ReportWhatsAppCta";
import { PhysioAuditRecord, SAMPLE_PHYSIO_AUDIT } from "@/lib/physio-data";
import { resolveAuditAsync } from "@/lib/audit-storage";
import { Loader2 } from "lucide-react";

function ReportContent({ record }: { record: PhysioAuditRecord }) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. Interactive Header Navigation & Actions */}
      <ReportHeader record={record} />

      {/* 2. Executive Cover & Diagnostic Summary */}
      <ReportCover record={record} />

      {/* 3. 5-Pillar Kinetic Chain Balance Visualizer */}
      <ReportBreakdown pillars={record.pillars} />

      {/* 4. Core Mechanical Breakdowns Discovered */}
      <ReportDangerCards flags={record.flags} />

      {/* 5. Prescribed 3-Phase Clinical Rehabilitation Protocol */}
      <ReportRehabProtocol rehabProtocol={record.rehabProtocol} />

      {/* 6. Physiotherapist Consultation Summary */}
      <ReportPhysioScript consultationScript={record.consultationScript} />

      {/* 7. Direct WhatsApp Conversion CTA to Clinic (8368052044) */}
      <ReportWhatsAppCta record={record} />

      {/* Report Footer */}
      <footer className="text-center py-10 text-xs text-slate-500 space-y-1.5 font-mono border-t border-slate-900 mt-12">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-md bg-teal-500/10 text-teal-400 font-black text-[10px] flex items-center justify-center font-mono border border-teal-500/30">
            KF
          </div>
          <p className="font-extrabold text-slate-400 uppercase tracking-wider text-[11px]">
            KineticFix · Clinical Physiotherapy & Biomechanical Audit System
          </p>
        </div>
        <p className="text-[11px] text-slate-600">
          Confidential Musculoskeletal Screen & Corrective Care Pathway · Ref #{record.id}
        </p>
      </footer>
    </div>
  );
}

export default function PhysioReportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-100 selection:bg-teal-500 selection:text-black">
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
              <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                Analyzing Biomechanical Data...
              </p>
            </div>
          }
        >
          <ReportViewerWrapper />
        </Suspense>
      </main>
    </div>
  );
}

function ReportViewerWrapper() {
  const searchParams = useSearchParams();
  const [record, setRecord] = useState<PhysioAuditRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get("id");
    const payload = searchParams.get("d");

    let isMounted = true;
    setIsLoading(true);

    resolveAuditAsync(id, payload).then((resolved) => {
      if (isMounted) {
        setRecord(resolved);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  if (isLoading || !record) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
          Loading Clinical Intelligence...
        </p>
      </div>
    );
  }

  return <ReportContent record={record} />;
}
