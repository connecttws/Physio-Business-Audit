import {
  PhysioAuditRecord,
  PatientDetails,
  calculatePhysioAudit,
  SAMPLE_PHYSIO_AUDIT,
} from "./physio-data";

const STORAGE_PREFIX = "physio_audit_";
const LIST_KEY = "physio_audits_index";

export function saveAuditToStorage(record: PhysioAuditRecord): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PREFIX + record.id, JSON.stringify(record));

    // Maintain index of audits
    const rawList = localStorage.getItem(LIST_KEY);
    let list: Array<{
      id: string;
      name: string;
      trackBadge: string;
      date: string;
      score: number;
      phone?: string;
    }> = [];
    if (rawList) {
      try {
        list = JSON.parse(rawList);
      } catch {
        list = [];
      }
    }
    // Remove duplicate if exists
    list = list.filter((item) => item.id !== record.id);
    list.unshift({
      id: record.id,
      name: record.patient.name,
      trackBadge: record.trackBadge,
      date: record.createdAt,
      score: record.totalScore,
      phone: record.patient.whatsappNumber || record.patient.phone,
    });
    // Keep last 50
    localStorage.setItem(LIST_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (err) {
    console.error("Failed to save audit to localStorage:", err);
  }
}

export function getAuditFromStorage(id: string): PhysioAuditRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    if (raw) {
      return JSON.parse(raw) as PhysioAuditRecord;
    }
  } catch (err) {
    console.error("Failed to read audit from localStorage:", err);
  }
  return null;
}

export function getAuditsList(): Array<{
  id: string;
  name: string;
  trackBadge: string;
  date: string;
  score: number;
  phone?: string;
}> {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read audits index:", err);
  }
  return [];
}

/**
 * Compact encoder to allow full cross-device sharing via URL parameter (?d=...)
 * Enables patients to view their exact report directly from WhatsApp on any phone without a database.
 */
export function encodeAuditForUrl(record: PhysioAuditRecord): string {
  try {
    const minified = {
      i: record.id,
      c: record.createdAt,
      p: [
        record.patient.name,
        record.patient.whatsappNumber || record.patient.phone || "",
        record.patient.age || "",
        record.patient.occupation || "",
        record.patient.track || "lumbar",
        record.patient.auditorName || "",
      ],
      t: record.trackId,
      rf: record.redFlag,
      ph: record.pastHistory,
      a: record.answers,
    };
    const jsonStr = JSON.stringify(minified);
    if (typeof window !== "undefined") {
      return encodeURIComponent(btoa(encodeURIComponent(jsonStr)));
    }
    return "";
  } catch (err) {
    console.error("Error encoding audit for URL:", err);
    return "";
  }
}

export function decodeAuditFromUrl(payloadStr: string): PhysioAuditRecord | null {
  try {
    if (!payloadStr) return null;
    const decodedJson = decodeURIComponent(atob(decodeURIComponent(payloadStr)));
    const minified = JSON.parse(decodedJson);

    const patient: PatientDetails = {
      name: minified.p[0],
      phone: minified.p[1],
      whatsappNumber: minified.p[1],
      age: minified.p[2],
      occupation: minified.p[3],
      track: minified.p[4] || minified.t || "lumbar",
      auditorName: minified.p[5] || undefined,
    };

    return calculatePhysioAudit(
      patient,
      minified.t || patient.track,
      minified.a || {},
      minified.rf || "safe",
      minified.ph || "pills_heat",
      minified.i
    );
  } catch (err) {
    console.error("Error decoding audit from URL payload:", err);
    return null;
  }
}

export async function saveAudit(
  patient: PatientDetails,
  trackId: string,
  answers: Record<string, number>,
  redFlag: "safe" | "alert" | "" = "safe",
  pastHistory: "pills_heat" | "short_physio" | "first_time" | "" = "pills_heat"
): Promise<PhysioAuditRecord> {
  try {
    const res = await fetch("/api/audits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient, trackId, answers, redFlag, pastHistory }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.audit) {
        saveAuditToStorage(data.audit);
        return data.audit;
      }
    }
  } catch (err) {
    console.warn("API database save failed, falling back to local calculation:", err);
  }

  // Fallback: calculate locally & save to localStorage
  const localRecord = calculatePhysioAudit(
    patient,
    trackId,
    answers,
    redFlag,
    pastHistory
  );
  saveAuditToStorage(localRecord);
  return localRecord;
}

export async function resolveAuditAsync(
  id?: string | null,
  payload?: string | null
): Promise<PhysioAuditRecord> {
  // 1. Try URL payload if present (cross-device shareable link)
  if (payload) {
    const fromPayload = decodeAuditFromUrl(payload);
    if (fromPayload) {
      saveAuditToStorage(fromPayload);
      return fromPayload;
    }
  }

  // 2. Try fetching from Database API by ID
  if (id) {
    try {
      const res = await fetch(`/api/audits/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audit) {
          saveAuditToStorage(data.audit);
          return data.audit;
        }
      }
    } catch (err) {
      console.warn("API lookup failed, falling back to local storage:", err);
    }
  }

  // 3. Try Local Storage
  if (id) {
    const fromStorage = getAuditFromStorage(id);
    if (fromStorage) return fromStorage;
  }

  // 4. Fallback sample audit
  return SAMPLE_PHYSIO_AUDIT;
}

export interface AuditListItem {
  id: string;
  name: string;
  trackBadge: string;
  occupation?: string;
  whatsappNumber?: string;
  date: string;
  score: number;
  statusTitle?: string;
}

export interface AuditsListResponse {
  audits: AuditListItem[];
  total: number;
  hasMore: boolean;
}

export async function fetchAuditsListFromApi(options?: {
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<AuditsListResponse> {
  const limit = options?.limit ?? 5;
  const offset = options?.offset ?? 0;
  const search = options?.search?.trim() ?? "";

  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (search) params.set("search", search);

    const res = await fetch(`/api/audits?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.audits) && (data.total > 0 || data.audits.length > 0)) {
        return {
          audits: data.audits,
          total: typeof data.total === "number" ? data.total : data.audits.length,
          hasMore: Boolean(data.hasMore),
        };
      }
    }
  } catch (err) {
    console.warn("API fetch failed for audits list:", err);
  }

  // Fallback to local storage
  const allLocal = getAuditsList();
  const filtered = search
    ? allLocal.filter((item) => {
        const q = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.trackBadge.toLowerCase().includes(q)
        );
      })
    : allLocal;

  const pageItems = filtered.slice(offset, offset + limit).map((item) => ({
    id: item.id,
    name: item.name,
    trackBadge: item.trackBadge,
    whatsappNumber: item.phone,
    date: item.date,
    score: item.score,
  }));

  return {
    audits: pageItems,
    total: filtered.length,
    hasMore: offset + limit < filtered.length,
  };
}
