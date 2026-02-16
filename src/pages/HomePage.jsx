import React, { useState, useMemo } from "react";
import { Thermometer, Leaf, BarChart3, TrendingUp, ChevronDown } from "lucide-react";
import { plants } from "../data/sampleData";
import MetricCard from "../components/MetricCard";
import TrendChart from "../components/TrendChart";
import HeatmapSection from "../components/HeatmapSection";
import EmbedSection from "../components/EmbedSection";
import DataTable from "../components/DataTable";

export default function HomePage() {
  const [selectedPlantId, setSelectedPlantId] = useState(plants[0]?.id ?? "");
  const [trendParam, setTrendParam] = useState("height");

  const selectedPlant = useMemo(() => plants.find((p) => p.id === selectedPlantId) ?? plants[0], [selectedPlantId]);
  const metrics = selectedPlant?.metrics ?? {};
  const trends = selectedPlant?.trends ?? [];
  const dailyData = selectedPlant?.dailyData ?? [];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <header className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">Dashboard</h1>
          <div className="relative">
            <select
              id="plant-select"
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <MetricCard title="Leaf temperature" value={metrics.leafTemperature} unit="°C" icon={Thermometer} />
        <MetricCard title="Plant height" value={metrics.plantHeight} unit="cm" icon={Leaf} />
        <MetricCard title="Biomass" value={metrics.biomass} unit="g" icon={BarChart3} />
        <MetricCard title="Growth rate" value={metrics.growthRate} unit="cm/day" icon={TrendingUp} />
      </section>

      <div className="space-y-8 mb-10">
        <TrendChart data={trends} paramKey={trendParam} onParamChange={setTrendParam} />
        <DataTable data={dailyData} />
      </div>

      <EmbedSection selectedPlantId={selectedPlantId} />

      <section className="mt-10">
        <HeatmapSection selectedPlantId={selectedPlantId} />
      </section>
    </div>
  );
}
