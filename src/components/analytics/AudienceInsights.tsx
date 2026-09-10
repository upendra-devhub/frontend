"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  PieLabelRenderProps,
} from "recharts";
import { TrendAnalytics } from "@/data/types";
import { SectionHeader, FadeInSection } from "@/components/ui/SectionHeader";

// ── Age Gender Chart ─────────────────────────────────────────────────────────
function AgeGenderChart({ trend }: { trend: TrendAnalytics }) {
  const data = trend.demographics.ageGender;

  return (
    <div className="card flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold mb-1" style={{ color: "var(--navy)" }}>
          Age & Gender
        </h3>
        <p className="text-xs mb-3" style={{ color: "var(--slate)" }}>
          Estimated audience distribution (% share)
        </p>
      </div>
      <div className="chart-wrapper flex-1 flex items-center justify-center my-2" style={{ minHeight: 340, maxHeight: 420 }}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} barSize={14} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F5" />
            <XAxis dataKey="ageRange" tick={{ fontSize: 10, fill: "#52616B" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#52616B" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "11px" }}
            />
            <Legend wrapperStyle={{ fontSize: "10px", paddingTop: 8 }} iconSize={8} />
            <Bar dataKey="male" name="Male" fill="#4A7FA5" radius={[3, 3, 0, 0]} />
            <Bar dataKey="female" name="Female" fill="#C4614A" radius={[3, 3, 0, 0]} />
            <Bar dataKey="other" name="Other" fill="#C4943A" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs pt-3 border-t text-gray-400" style={{ borderColor: "#EEF2F5" }}>
        Demographic profile inferred from public interactions
      </p>
    </div>
  );
}

// ── Language Chart ───────────────────────────────────────────────────────────
const LANG_COLORS = ["#4A7FA5", "#5A9E7C", "#C4943A", "#C4614A", "#7B68A4", "#52616B"];

function LanguageChart({ trend }: { trend: TrendAnalytics }) {
  const data = trend.demographics.languages;

  // Custom label
  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
    if (percent < 0.07) return null;
    const RADIAN = Math.PI / 180;
    const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
    const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
    const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="card flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold mb-1" style={{ color: "var(--navy)" }}>
          Language Distribution
        </h3>
        <p className="text-xs mb-3" style={{ color: "var(--slate)" }}>
          Primary language of posts and discussions
        </p>
      </div>
      <div className="chart-wrapper flex-1 flex items-center justify-center my-2" style={{ minHeight: 340, maxHeight: 420 }}>
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={68}
              outerRadius={108}
              dataKey="share"
              nameKey="language"
              labelLine={false}
              label={renderCustomLabel}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={LANG_COLORS[i % LANG_COLORS.length]} />
              ))}
            </Pie>
            <Legend
              wrapperStyle={{ fontSize: "10px" }}
              iconSize={8}
              formatter={(value) => <span style={{ color: "var(--slate)" }}>{value}</span>}
            />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "11px" }}
              formatter={(val) => [`${val}%`, "Share"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs pt-3 border-t text-gray-400" style={{ borderColor: "#EEF2F5" }}>
        Multi-lingual NLP classification across active platforms
      </p>
    </div>
  );
}

// ── Region Chart (horizontal bar) ─────────────────────────────────────────────
function RegionChart({ trend }: { trend: TrendAnalytics }) {
  const data = [...trend.demographics.regions].sort((a, b) => b.share - a.share);

  return (
    <div className="card flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold mb-1" style={{ color: "var(--navy)" }}>
          Regional Distribution
        </h3>
        <p className="text-xs mb-3" style={{ color: "var(--slate)" }}>
          Top 5 states by trend activity (relative score)
        </p>
      </div>

      {/* Custom horizontal bars */}
      <div className="flex-1 flex flex-col justify-center gap-4 my-2">
        {data.map((region, i) => (
          <div key={region.state}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold" style={{ color: "var(--navy)" }}>
                {region.state}
              </span>
              <span className="text-xs" style={{ color: "var(--slate)" }}>
                {region.mentions}
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${region.share}%`,
                  background: i === 0
                    ? "var(--accent-blue)"
                    : i === 1
                    ? "var(--accent-green)"
                    : i === 2
                    ? "var(--accent-amber)"
                    : i === 3
                    ? "#7B68A4"
                    : "var(--slate)",
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs pt-3 border-t text-gray-400" style={{ borderColor: "#EEF2F5" }}>
        State-level choropleth map available in Slide 06 (Regional)
      </p>
    </div>
  );
}

// ── Main Section ─────────────────────────────────────────────────────────────
export default function AudienceInsights({ trend }: { trend: TrendAnalytics }) {
  return (
    <FadeInSection
      id="section-audience"
      className="section-wide analytics-content"
    >
      <SectionHeader trendName={trend.name} sectionName="Audience Insights" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch" style={{ minHeight: "clamp(560px, 76vh, 660px)" }}>
        <AgeGenderChart trend={trend} />
        <LanguageChart trend={trend} />
        <RegionChart trend={trend} />
      </div>
    </FadeInSection>
  );
}
