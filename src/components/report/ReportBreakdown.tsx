"use client";

import React from "react";
import { PillarScore } from "@/lib/physio-data";
import { Activity, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ReportBreakdownProps {
  pillars: PillarScore[];
}

export function ReportBreakdown({ pillars }: ReportBreakdownProps) {
  // SVG Radar Polygon calculations (5 vertices on a regular pentagon)
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const numPillars = pillars.length || 5;

  const getCoordinates = (index: number, scorePercentage: number) => {
    // Angle in radians (starting from top, rotating clockwise)
    const angle = (Math.PI * 2 / numPillars) * index - Math.PI / 2;
    const r = (scorePercentage / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate background pentagon grid points (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = gridLevels.map((lvl) => {
    return pillars
      .map((_, i) => {
        const angle = (Math.PI * 2 / numPillars) * i - Math.PI / 2;
        const r = lvl * radius;
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
      })
      .join(" ");
  });

  // Patient polygon points
  const patientPoints = pillars
    .map((p, i) => {
      const { x, y } = getCoordinates(i, p.score);
      return `${x},${y}`;
    })
    .join(" ");

  // Optimal target (95%) points
  const targetPoints = pillars
    .map((_, i) => {
      const { x, y } = getCoordinates(i, 95);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl print-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-teal-400 tracking-wider">
            Biomechanical Diagnostics
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
            5-Pillar Kinetic Chain Balance
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> Patient Baseline
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-slate-400" /> Target (95%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Radar Visualizer */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full overflow-visible"
            >
              {/* Background Radar Rings */}
              {gridPolygons.map((pts, idx) => (
                <polygon
                  key={idx}
                  points={pts}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={idx === 3 ? "none" : "2,2"}
                  opacity="0.6"
                />
              ))}

              {/* Radial Axis Lines */}
              {pillars.map((_, i) => {
                const { x, y } = getCoordinates(i, 100);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                );
              })}

              {/* Target 95% Polygon */}
              <polygon
                points={targetPoints}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                opacity="0.5"
              />

              {/* Patient Polygon */}
              <polygon
                points={patientPoints}
                fill="rgba(20, 184, 166, 0.25)"
                stroke="#14b8a6"
                strokeWidth="2.5"
              />

              {/* Patient Corner Dots */}
              {pillars.map((p, i) => {
                const { x, y } = getCoordinates(i, p.score);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="#14b8a6"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Labels on SVG */}
              {pillars.map((p, i) => {
                const labelDist = 124;
                const angle = (Math.PI * 2 / numPillars) * i - Math.PI / 2;
                const lx = center + labelDist * Math.cos(angle);
                const ly = center + labelDist * Math.sin(angle);

                let textAnchor: "middle" | "start" | "end" = "middle";
                if (Math.cos(angle) > 0.3) textAnchor = "start";
                else if (Math.cos(angle) < -0.3) textAnchor = "end";

                return (
                  <text
                    key={i}
                    x={lx}
                    y={ly + 4}
                    textAnchor={textAnchor}
                    className="text-[10px] font-sans font-bold fill-slate-300"
                  >
                    {p.name}
                  </text>
                );
              })}
            </svg>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-4 text-center">
            Inner polygon indicates restricted joint range & muscle inhibition.
          </p>
        </div>

        {/* Detailed Itemized Progress Bars */}
        <div className="lg:col-span-7 space-y-3.5">
          {pillars.map((p) => {
            const isCritical = p.score < 45;
            const isModerate = p.score >= 45 && p.score < 75;

            const barColor = isCritical
              ? "bg-red-500"
              : isModerate
              ? "bg-amber-400"
              : "bg-teal-400";

            const badgeColor = isCritical
              ? "text-red-300 bg-red-500/15 border-red-500/30"
              : isModerate
              ? "text-amber-300 bg-amber-500/15 border-amber-500/30"
              : "text-emerald-300 bg-emerald-500/15 border-emerald-500/30";

            return (
              <div
                key={p.name}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-200">
                      {p.name}
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${badgeColor}`}>
                      {isCritical ? "Deficit" : isModerate ? "Moderate" : "Optimal"}
                    </span>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="font-bold text-white">{p.score}%</span>
                    <span className="text-[10px] text-slate-500"> / 95% target</span>
                  </div>
                </div>

                {/* Dual Progress Bar */}
                <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(100, p.score)}%` }}
                  />
                  {/* 95% optimal marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-400 opacity-60"
                    style={{ left: "95%" }}
                    title="Optimal Target: 95%"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
