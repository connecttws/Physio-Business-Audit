import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculatePhysioAudit,
  PatientDetails,
  TRACK_DATA,
} from "@/lib/physio-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patient, trackId, answers, redFlag, pastHistory } = body as {
      patient: PatientDetails;
      trackId: string;
      answers: Record<string, number>;
      redFlag?: "safe" | "alert";
      pastHistory?: "pills_heat" | "short_physio" | "first_time";
    };

    if (!patient?.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Patient name is required" },
        { status: 400 }
      );
    }

    const calculated = calculatePhysioAudit(
      patient,
      trackId || "lumbar",
      answers || {},
      redFlag || "safe",
      pastHistory || "pills_heat"
    );

    try {
      const saved = await (prisma as any).physioAudit.create({
        data: {
          patientName: calculated.patient.name.trim(),
          slug: calculated.id,
          phone: calculated.patient.phone || null,
          whatsappNumber:
            calculated.patient.whatsappNumber ||
            calculated.patient.phone ||
            null,
          age: calculated.patient.age || null,
          occupation: calculated.patient.occupation || "Not Specified",
          auditorName: calculated.patient.auditorName || "Dr. KineticFix",

          trackId: calculated.trackId,
          trackBadge: calculated.trackBadge,
          redFlag: calculated.redFlag,
          pastHistory: calculated.pastHistory,

          totalScore: calculated.totalScore,
          maxScore: calculated.maxScore,
          percentage: calculated.percentage,
          statusTitle: calculated.status.title,
          statusLevel: calculated.status.level,
          statusSummary: calculated.status.summary,
          consultationScript: calculated.consultationScript,

          pillars: calculated.pillars as any,
          answers: calculated.answers as any,
          flags: calculated.flags as any,
          rehabProtocol: calculated.rehabProtocol as any,
        },
      });

      const shortUrl = `/r/${saved.id}`;
      const fullUrl = `/report?id=${saved.id}`;

      return NextResponse.json(
        {
          success: true,
          audit: {
            ...calculated,
            id: saved.id,
            createdAt: saved.createdAt.toISOString(),
          },
          id: saved.id,
          shortUrl,
          fullUrl,
        },
        { status: 201 }
      );
    } catch (dbErr) {
      console.warn("Prisma DB create failed, returning calculated audit:", dbErr);
      return NextResponse.json(
        {
          success: true,
          audit: calculated,
          id: calculated.id,
          shortUrl: `/report?id=${calculated.id}`,
          fullUrl: `/report?id=${calculated.id}`,
        },
        { status: 200 }
      );
    }
  } catch (err: any) {
    console.error("Error creating physio audit:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create audit" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "5", 10)));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
    const search = searchParams.get("search")?.trim() || "";

    try {
      const where: any = {};
      if (search) {
        where.OR = [
          { patientName: { contains: search, mode: "insensitive" } },
          { trackBadge: { contains: search, mode: "insensitive" } },
          { occupation: { contains: search, mode: "insensitive" } },
        ];
      }

      const [records, total] = await Promise.all([
        (prisma as any).physioAudit.findMany({
          where,
          select: {
            id: true,
            patientName: true,
            trackBadge: true,
            occupation: true,
            whatsappNumber: true,
            totalScore: true,
            statusTitle: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        (prisma as any).physioAudit.count({ where }),
      ]);

      const audits = records.map((r: any) => ({
        id: r.id,
        name: r.patientName,
        trackBadge: r.trackBadge,
        occupation: r.occupation,
        whatsappNumber: r.whatsappNumber,
        date: r.createdAt.toISOString(),
        score: r.totalScore,
        statusTitle: r.statusTitle,
      }));

      return NextResponse.json({
        success: true,
        audits,
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      });
    } catch (dbErr) {
      console.warn("Prisma fetch failed, returning empty list fallback:", dbErr);
      return NextResponse.json({
        success: true,
        audits: [],
        total: 0,
        limit,
        offset,
        hasMore: false,
      });
    }
  } catch (err: any) {
    console.error("Error fetching physio audits:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch audits" },
      { status: 500 }
    );
  }
}
