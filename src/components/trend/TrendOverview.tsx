"use client";

import { TrendAnalytics } from "@/data/types";
import { SectionHeader, FadeInSection, PlatformIcon, GrowthBadge } from "@/components/ui/SectionHeader";
import TrendSlideshow from "./TrendSlideshow";

interface TrendOverviewProps {
  trend: TrendAnalytics;
}

const PLATFORM_LABELS = { x: "X (Twitter)", reddit: "Reddit", telegram: "Telegram" };

function PlatformActivityBar({
  platform,
  score,
}: {
  platform: "x" | "reddit" | "telegram";
  score: number;
}) {
  const label =
    score >= 80 ? "High" : score >= 55 ? "Medium" : "Low";
  const color =
    score >= 80 ? "var(--accent-green)" : score >= 55 ? "var(--accent-amber)" : "var(--slate)";

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 w-28 shrink-0">
        <span style={{ color: platform === "x" ? "var(--navy)" : platform === "reddit" ? "#8B4513" : "var(--accent-blue)" }}>
          <PlatformIcon platform={platform} size={14} />
        </span>
        <span className="text-xs font-medium" style={{ color: "var(--slate)" }}>
          {PLATFORM_LABELS[platform]}
        </span>
      </div>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>
        {score}
      </span>
      <span className="text-xs w-12" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

// Trend score ring
function TrendScoreRing({ score }: { score: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="var(--secondary)" strokeWidth="8" />
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="var(--accent-blue)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          className="score-ring-circle"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black" style={{ color: "var(--navy)" }}>
          {score}
        </span>
        <span className="text-xs" style={{ color: "var(--slate)" }}>/ 100</span>
      </div>
    </div>
  );
}

export default function TrendOverview({ trend }: TrendOverviewProps) {
  return (
    <FadeInSection id="section-overview" className="section-wide analytics-content">
      <SectionHeader trendName={trend.name} sectionName="Trend Overview" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch" style={{ minHeight: "clamp(560px, 76vh, 660px)" }}>
        {/* Left: Description + metrics — spans 3 cols */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-5 h-full">
          <div className="space-y-4">
            {/* Trend name */}
            <h2
              className="text-3xl sm:text-4xl font-black"
              style={{ color: "var(--navy)", fontFamily: "var(--font-playfair, serif)" }}
            >
              {trend.name}
            </h2>

            {/* Category + Growth */}
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "var(--secondary)", color: "var(--slate)" }}
              >
                {trend.category}
              </span>
              <GrowthBadge value={trend.growthPercent} />
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: "var(--slate)" }}>
              {trend.description}
            </p>

            {/* Metric chips */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Mentions", value: trend.totalMentions },
                { label: "Approx. Reach", value: trend.approximateReach },
                { label: "Growth (30D)", value: trend.growthPercent },
              ].map((m) => (
                <div key={m.label} className="card-sm text-center">
                  <p className="text-lg font-black" style={{ color: "var(--navy)" }}>{m.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Activity */}
          <div className="card flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold" style={{ color: "var(--navy)" }}>
                  Platform Activity
                </h3>
                <span className="text-xs" style={{ color: "var(--slate)" }}>
                  Normalized 0–100
                </span>
              </div>
              <p className="text-xs mb-3" style={{ color: "var(--slate)" }}>
                Cross-platform signals are normalized before comparison. Raw engagement metrics (likes, upvotes, reactions) are not directly equivalent across platforms.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <PlatformActivityBar platform="x" score={trend.platformActivity.x} />
              <PlatformActivityBar platform="reddit" score={trend.platformActivity.reddit} />
              <PlatformActivityBar platform="telegram" score={trend.platformActivity.telegram} />
            </div>
          </div>
        </div>

        {/* Right: Score ring + Slideshow — spans 2 cols */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-5 h-full">
          {/* Trend Score Card */}
          <div className="card flex-1 flex flex-col items-center justify-center text-center gap-3">
            <p className="section-label">Trend Score</p>
            <TrendScoreRing score={trend.trendScore} />
            <p className="text-xs max-w-xs" style={{ color: "var(--slate)" }}>
              Composite normalized score derived from platform activity, growth velocity, and engagement breadth.
            </p>
          </div>

          {/* Simulated posts slideshow */}
          <div className="card flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">Trending Posts</p>
              <span className="prototype-badge">Simulated</span>
            </div>
            <TrendSlideshow trend={trend} />
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
