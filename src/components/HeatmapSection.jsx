import React, { useMemo, useState, useRef } from "react";
import { INDEX_CATEGORY, CATEGORY_LABELS, SECTION_TITLE } from "../data/heatmapCategories";
import { ChevronDown, ChevronRight, Layers, Maximize2 } from "lucide-react";
import PlotlyChart from "./PlotlyChart";

// Heatmaps are per plant under plant 1/, plant 2/, plant 3/
const heatmapGlobPlant1 = import.meta.glob("../assets/plant 1/heatmap_*.json", { query: "?url", import: "default", eager: true });
const heatmapGlobPlant2 = import.meta.glob("../assets/plant 2/heatmap_*.json", { query: "?url", import: "default", eager: true });
const heatmapGlobPlant3 = import.meta.glob("../assets/plant 3/heatmap_*.json", { query: "?url", import: "default", eager: true });

const HEATMAP_GLOB_BY_PLANT_ID = {
  "plant-1": heatmapGlobPlant1,
  "plant-2": heatmapGlobPlant2,
  "plant-3": heatmapGlobPlant3,
};

function useHeatmapJsonUrls(selectedPlantId = "plant-1") {
  return useMemo(() => {
    const glob = HEATMAP_GLOB_BY_PLANT_ID[selectedPlantId] ?? heatmapGlobPlant1;
    const out = {};
    for (const [path, url] of Object.entries(glob)) {
      const match = path.match(/heatmap_(\w+)\.json/);
      if (match) out[match[1]] = url;
    }
    return out;
  }, [selectedPlantId]);
}

function HeatmapCard({ name, jsonUrl }) {
  const fullscreenRef = useRef(null);

  const openFullscreen = () => {
    const el = fullscreenRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">{name}</p>
        <button
          type="button"
          onClick={openFullscreen}
          className="p-1.5 rounded-md text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10 transition"
          aria-label={`Fullscreen ${name}`}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={fullscreenRef}
        className="aspect-square w-full flex items-center justify-center bg-gray-900 overflow-hidden"
        style={{ minHeight: 160 }}
      >
        <PlotlyChart
          jsonUrl={jsonUrl}
          className="w-full h-full flex items-center justify-center"
          style={{ minWidth: 0, minHeight: 0 }}
        />
      </div>
    </div>
  );
}

export default function HeatmapSection({ selectedPlantId = "plant-1" }) {
  const [expandedCategory, setExpandedCategory] = useState("biomass");
  const urls = useHeatmapJsonUrls(selectedPlantId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800">
        <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{SECTION_TITLE}</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.entries(INDEX_CATEGORY).map(([catKey, indices]) => {
          const label = CATEGORY_LABELS[catKey] ?? catKey;
          const isOpen = expandedCategory === catKey;
          const available = indices.filter((name) => urls[name]);
          if (available.length === 0) return null;
          return (
            <div key={catKey} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setExpandedCategory(isOpen ? null : catKey)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-left transition"
              >
                <span className="font-medium text-gray-800 dark:text-white">{label}</span>
                {isOpen ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
              </button>
              {isOpen && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800">
                  {available.map((name) => (
                    <HeatmapCard key={name} name={name} jsonUrl={urls[name]} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
