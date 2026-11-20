import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PhysioAuditRecord } from "@/lib/physio-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Audit ID is required" },
        { status: 400 }
      );
    }

    const record = await (prisma as any).physioAudit.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Audit record not found" },
        { status: 404 }
      );
    }

    (prisma as any).physioAudit
      .update({
        where: { id: record.id },
        data: {
          viewCount: { increment: 1 },
          lastViewedAt: new Date(),
        },
      })
      .catch((err: unknown) => console.error("Error updating view count:", err));

    const formatted: PhysioAuditRecord = {
      id: record.id,
      createdAt: record.createdAt.toISOString(),
      patient: {
        name: record.patientName,
        phone: record.phone || undefined,
        whatsappNumber: record.whatsappNumber || undefined,
        age: record.age || undefined,
        occupation: record.occupation || undefined,
        track: record.trackId,
        auditorName: record.auditorName,
        date: record.createdAt.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
      trackId: record.trackId,
      trackTitle: record.trackBadge,
      trackBadge: record.trackBadge,
      redFlag: (record.redFlag as "safe" | "alert") || "safe",
      pastHistory: (record.pastHistory as "pills_heat" | "short_physio" | "first_time") || "pills_heat",
      answers: record.answers as Record<string, number>,
      flags: record.flags as string[],
      totalScore: record.totalScore,
      maxScore: record.maxScore,
      percentage: record.percentage,
      status: {
        title: record.statusTitle,
        level: record.statusLevel as any,
        color:
          record.statusLevel === "severe"
            ? "text-red-400"
            : record.statusLevel === "moderate"
            ? "text-amber-400"
            : "text-emerald-400",
        summary: record.statusSummary,
      },
      pillars: record.pillars as any,
      rehabProtocol: record.rehabProtocol as any,
      consultationScript: record.consultationScript,
    };

    return NextResponse.json({ success: true, audit: formatted });
  } catch (err: any) {
    console.error("Error fetching audit by ID:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch audit" },
      { status: 500 }
    );
  }
}
