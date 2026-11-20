"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { X, ExternalLink, Search, Loader2, ChevronDown, Activity, User, Phone } from "lucide-react";
import { fetchAuditsListFromApi, AuditListItem } from "@/lib/audit-storage";

interface RecentAuditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecentAuditsModal({ isOpen, onClose }: RecentAuditsModalProps) {
  const [list, setList] = useState<AuditListItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchRecords = useCallback(async (searchQuery: string, offset = 0, isAppend = false) => {
    if (isAppend) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const res = await fetchAuditsListFromApi({
        limit: 5,
        offset,
        search: searchQuery,
      });

      if (isAppend) {
        setList((prev) => [...prev, ...res.audits]);
      } else {
        setList(res.audits);
      }
      setTotalCount(res.total);
      setHasMore(res.hasMore);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      fetchRecords("", 0, false);
    }
  }, [isOpen, fetchRecords]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchRecords(search, 0, false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, isOpen, fetchRecords]);

  const handleViewMore = () => {
    if (isLoadingMore || !hasMore) return;
    fetchRecords(search, list.length, true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-white">
              Patient Assessment Records
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical clinical audits & diagnostic reports
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/60">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, track, or occupation..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 transition-colors placeholder:text-slate-500 font-sans"
            />
            {isLoading && (
              <Loader2 className="w-4 h-4 text-teal-400 animate-spin absolute right-3 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Audit List Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {list.length === 0 && !isLoading ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Activity className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-50" />
              <p className="font-semibold text-slate-400">No clinical records found</p>
              <p className="text-[11px] mt-0.5 text-slate-600">
                Complete a diagnostic screen to create your first report.
              </p>
            </div>
          ) : (
            list.map((item) => {
              const scoreColor =
                item.score >= 75
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                  : item.score >= 45
                  ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                  : "text-red-400 bg-red-500/10 border-red-500/30";

              return (
                <Link
                  key={item.id}
                  href={`/report?id=${item.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-teal-500/50 hover:bg-slate-800/60 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 shrink-0 group-hover:border-teal-500/40">
                      <User className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors truncate">
                          {item.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono font-semibold shrink-0">
                          {item.trackBadge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {item.occupation || "Musculoskeletal Screen"}
                        {item.whatsappNumber && ` · ${item.whatsappNumber}`}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-lg border font-mono font-black text-xs ${scoreColor}`}>
                        {item.score}
                        <span className="text-[10px] font-normal text-slate-400">/100</span>
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
                  </div>
                </Link>
              );
            })
          )}

          {/* View More Button (Loads 5 More) */}
          {hasMore && (
            <div className="pt-2 pb-1 text-center">
              <button
                type="button"
                onClick={handleViewMore}
                disabled={isLoadingMore}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                    <span>Loading +5 Records...</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 text-teal-400" />
                    <span>View More (+5 Records)</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({list.length} of {totalCount})
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>{totalCount} Total Recorded Audits</span>
          <span className="text-teal-400">KineticFix System</span>
        </div>
      </div>
    </div>
  );
}
