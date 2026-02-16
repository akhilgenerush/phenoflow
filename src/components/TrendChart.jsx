import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from "recharts";

export const PARAM_OPTIONS = [
  { key: "height", label: "Height", unit: "cm", color: "#16a34a" },
  { key: "biomass", label: "Biomass", unit: "g", color: "#6366f1" },
  { key: "leafTemp", label: "Leaf temperature", unit: "°C", color: "#ea580c" },
  { key: "growthRate", label: "Growth rate", unit: "cm/day", color: "#0d9488" },
];

const CustomTooltip = ({ active, payload, label, paramKey, unit }) => {
  if (!active || !payload?.length || !paramKey) return null;
  const p = PARAM_OPTIONS.find((o) => o.key === paramKey);
  const value = payload[0]?.value;
  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
      <p className="text-sm" style={{ color: p?.color ?? "#16a34a" }}>
        {p?.label ?? paramKey}: {value} {unit ?? p?.unit ?? ""}
      </p>
    </div>
  );
};

export default function TrendChart({ data, paramKey = "height", onParamChange }) {
  const param = PARAM_OPTIONS.find((p) => p.key === paramKey) ?? PARAM_OPTIONS[0];
  const chartData = useMemo(() => (Array.isArray(data) ? data : []).map((d) => ({ ...d })), [data]);

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Growth trend</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="trend-param" className="text-sm text-gray-600 dark:text-gray-400">Parameter:</label>
          <select
            id="trend-param"
            value={paramKey}
            onChange={(e) => onParamChange?.(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {PARAM_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
          <XAxis dataKey="day" className="text-gray-600 dark:text-gray-400" />
          <YAxis className="text-gray-600 dark:text-gray-400" />
          <Tooltip content={<CustomTooltip paramKey={paramKey} unit={param.unit} />} />
          <Legend wrapperStyle={{ color: "inherit" }} />
          <Line type="monotone" dataKey={paramKey} name={param.label} stroke={param.color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Brush dataKey="day" height={28} stroke={param.color} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
