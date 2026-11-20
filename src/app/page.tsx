"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AuditorNav } from "@/components/AuditorNav";
import { ClinicalQuestionnaire } from "@/components/ClinicalQuestionnaire";
import { AuditCompleteStep } from "@/components/AuditCompleteStep";
import { RecentAuditsModal } from "@/components/RecentAuditsModal";
import {
  PatientDetails,
  TRACK_DATA,
  calculatePhysioAudit,
  PhysioAuditRecord,
} from "@/lib/physio-data";
import { saveAudit, getAuditsList } from "@/lib/audit-storage";

export default function PhysioAuditPage() {
  const [patient, setPatient] = useState<PatientDetails>({
    name: "",
    phone: "",
    whatsappNumber: "",
    age: "",
    occupation: "",
    track: "lumbar",
    auditorName: "Dr. KineticFix",
  });

  const [selectedTrack, setSelectedTrack] = useState<string>("lumbar");
  const [redFlag, setRedFlag] = useState<"safe" | "alert">("safe");
  const [pastHistory, setPastHistory] = useState<"pills_heat" | "short_physio" | "first_time">("pills_heat");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completedRecord, setCompletedRecord] = useState<PhysioAuditRecord | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const currentTrackData = TRACK_DATA[selectedTrack] || TRACK_DATA.lumbar;

  // Compute live score dynamically based on track questions
  const liveScore = useMemo(() => {
    let sum = 0;
    let max = 0;
    currentTrackData.questions.forEach((q) => {
      const chosenIdx = answers[q.id] ?? 0;
      const opt = q.options[chosenIdx] || q.options[0];
      sum += opt.val;
      max += 50;
    });
    return Math.round((sum / max) * 100);
  }, [answers, currentTrackData]);

  // Answered questions in the active track
  const answeredCount = useMemo(() => {
    return currentTrackData.questions.filter((q) => answers[q.id] !== undefined).length;
  }, [answers, currentTrackData]);

  useEffect(() => {
    setHistoryCount(getAuditsList().length);
  }, [completedRecord]);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handlePatientChange = (fields: Partial<PatientDetails>) => {
    setPatient((prev) => ({ ...prev, ...fields }));
  };

  const handleSelectTrack = (trackKey: string) => {
    setSelectedTrack(trackKey);
    setPatient((prev) => ({ ...prev, track: trackKey }));
  };

  const handleGenerateReport = async () => {
    if (!patient.name.trim()) {
      alert("Please enter Patient Full Name before generating the clinical report.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSaving(true);
    try {
      const record = await saveAudit(
        patient,
        selectedTrack,
        answers,
        redFlag,
        pastHistory
      );
      setCompletedRecord(record);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error saving audit:", err);
      const fallback = calculatePhysioAudit(
        patient,
        selectedTrack,
        answers,
        redFlag,
        pastHistory
      );
      setCompletedRecord(fallback);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetAudit = () => {
    setPatient({
      name: "",
      phone: "",
      whatsappNumber: "",
      age: "",
      occupation: "",
      track: "lumbar",
      auditorName: "Dr. KineticFix",
    });
    setSelectedTrack("lumbar");
    setRedFlag("safe");
    setPastHistory("pills_heat");
    setAnswers({});
    setCompletedRecord(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-100 selection:bg-teal-500 selection:text-black">
      {/* Top Navigation */}
      <AuditorNav
        patientName={patient.name}
        trackBadge={currentTrackData.badge}
        currentScore={liveScore}
        maxScore={100}
        answeredCount={answeredCount}
        totalQuestions={6}
        hasRedFlagAlert={redFlag === "alert"}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyCount}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-8">
        {!completedRecord ? (
          <ClinicalQuestionnaire
            patient={patient}
            onPatientChange={handlePatientChange}
            selectedTrack={selectedTrack}
            onSelectTrack={handleSelectTrack}
            redFlag={redFlag}
            onRedFlagChange={setRedFlag}
            pastHistory={pastHistory}
            onPastHistoryChange={setPastHistory}
            answers={answers}
            onAnswer={handleAnswer}
            onGenerateReport={handleGenerateReport}
            currentScore={liveScore}
          />
        ) : (
          <AuditCompleteStep
            record={completedRecord}
            onReviewAnswers={() => {
              if (completedRecord?.patient.whatsappNumber) {
                setPatient((prev) => ({
                  ...prev,
                  whatsappNumber: completedRecord.patient.whatsappNumber,
                  phone: completedRecord.patient.whatsappNumber,
                }));
              }
              setCompletedRecord(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onReset={handleResetAudit}
          />
        )}
      </main>

      <RecentAuditsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
