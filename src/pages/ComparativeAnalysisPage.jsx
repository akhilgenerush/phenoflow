import React, { useState } from "react";
import { ChevronDown, Layers, Download } from "lucide-react";
import { plants } from "../data/sampleData";
import { PARAM_OPTIONS } from "../components/TrendChart";
import { INDEX_CATEGORY } from "../data/heatmapCategories";
import PlotlyChart from "../components/PlotlyChart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// --- Asset Imports for Visuals ---
import leavesMorphologyPlant1Url from "../assets/plant 1/leaves_morphology.json?url";
import leavesMorphologyPlant2Url from "../assets/plant 2/leaves_morphology.json?url";
import leavesMorphologyPlant3Url from "../assets/plant 3/leaves_morphology.json?url";
import plantLidarPlant1Url from "../assets/plant 1/plant_lidar_data.json?url";
import plantLidarPlant2Url from "../assets/plant 2/plant_lidar_data.json?url";
import plantLidarPlant3Url from "../assets/plant 3/plant_lidar_data.json?url";

// --- Asset Globs for Heatmaps ---
const heatmapGlobPlant1 = import.meta.glob("../assets/plant 1/heatmap_*.json", { query: "?url", import: "default", eager: true });
const heatmapGlobPlant2 = import.meta.glob("../assets/plant 2/heatmap_*.json", { query: "?url", import: "default", eager: true });
const heatmapGlobPlant3 = import.meta.glob("../assets/plant 3/heatmap_*.json", { query: "?url", import: "default", eager: true });

// --- Configuration Constants ---
const COMPARE_TYPES = [
  { id: "trends", label: "Trends" },
  { id: "visuals", label: "Visuals" },
  { id: "phenospectral", label: "Phenospectral" },
];

const VISUAL_OPTIONS = [
  { id: "morphology", label: "Leaf Morphology" },
  { id: "lidar", label: "3D Plant Plot" },
];

// Flatten heatmap categories for the dropdown
const PHENOSPECTRAL_OPTIONS = Object.entries(INDEX_CATEGORY).flatMap(([cat, indices]) => 
  indices.map(idx => ({ id: idx, label: idx, category: cat }))
).sort((a, b) => a.label.localeCompare(b.label));

// Mapping helpers
const LEAVES_MORPHOLOGY_BY_PLANT_ID = {
  "plant-1": leavesMorphologyPlant1Url,
  "plant-2": leavesMorphologyPlant2Url,
  "plant-3": leavesMorphologyPlant3Url,
};

const PLANT_LIDAR_BY_PLANT_ID = {
  "plant-1": plantLidarPlant1Url,
  "plant-2": plantLidarPlant2Url,
  "plant-3": plantLidarPlant3Url,
};

const HEATMAP_GLOB_BY_PLANT_ID = {
  "plant-1": heatmapGlobPlant1,
  "plant-2": heatmapGlobPlant2,
  "plant-3": heatmapGlobPlant3,
};

function getHeatmapUrl(plantId, indexName) {
  const glob = HEATMAP_GLOB_BY_PLANT_ID[plantId];
  if (!glob) return null;
  // Try to find the file key that ends with heatmap_{indexName}.json
  const entry = Object.entries(glob).find(([path]) => path.includes(`heatmap_${indexName}.json`));
  return entry ? entry[1] : null;
}

const PLANT_COLORS = {
  "plant-1": "#10b981", // emerald-500
  "plant-2": "#3b82f6", // blue-500
  "plant-3": "#f59e0b", // amber-500
};

export default function ComparativeAnalysisPage() {
  const [selectedPlantIds, setSelectedPlantIds] = useState(["plant-1", "plant-2"]);
  const [compareType, setCompareType] = useState("trends");
  
  // Specific selections for each type
  const [selectedTrendMetric, setSelectedTrendMetric] = useState(PARAM_OPTIONS[0].key);
  const [selectedVisual, setSelectedVisual] = useState(VISUAL_OPTIONS[0].id);
  const [selectedPhenoIndex, setSelectedPhenoIndex] = useState(PHENOSPECTRAL_OPTIONS[0]?.id || "NDVI");

  const togglePlant = (id) => {
    setSelectedPlantIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // --- Render Logic ---

  const renderTrendChart = () => {
    const metric = PARAM_OPTIONS.find(m => m.key === selectedTrendMetric) || PARAM_OPTIONS[0];
    
    // Prepare data: merge dailyData from selected plants
    // Assuming all plants have same days for simplicity, or we map by day
    const allDays = Array.from(new Set(plants.flatMap(p => p.dailyData.map(d => d.day))));
    const chartData = allDays.map(day => {
      const entry = { day };
      selectedPlantIds.forEach(plantId => {
        const plant = plants.find(p => p.id === plantId);
        const dayData = plant?.dailyData.find(d => d.day === day);
        if (dayData) {
          entry[plantId] = dayData[metric.key]; 
        }
      });
      return entry;
    });

    const downloadTrendCSV = () => {
      const headers = ["Day", ...selectedPlantIds.map(id => plants.find(p => p.id === id)?.name || id)];
      const rows = chartData.map(row => {
        return [row.day, ...selectedPlantIds.map(id => row[id] ?? "")].join(",");
      });
      
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `comparative_${metric.label.toLowerCase().replace(" ", "_")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Comparing {metric.label} ({metric.unit})
          </h3>
          <button
            onClick={downloadTrendCSV}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
            <XAxis dataKey="day" className="text-gray-600 dark:text-gray-400" />
            <YAxis className="text-gray-600 dark:text-gray-400" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              labelStyle={{ color: '#374151', fontWeight: 600 }}
            />
            <Legend />
            {selectedPlantIds.map(plantId => {
              const plant = plants.find(p => p.id === plantId);
              return (
                <Line
                  key={plantId}
                  type="monotone"
                  dataKey={plantId}
                  name={plant?.name || plantId}
                  stroke={PLANT_COLORS[plantId] || "#8884d8"}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderVisuals = () => {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedPlantIds.map(plantId => {
          const plant = plants.find(p => p.id === plantId);
          let url = null;
          let title = "";
          let isMorphology = false;

          if (selectedVisual === "morphology") {
            url = LEAVES_MORPHOLOGY_BY_PLANT_ID[plantId];
            title = "Leaf Morphology";
            isMorphology = true;
          } else {
            url = PLANT_LIDAR_BY_PLANT_ID[plantId];
            title = "3D Plant Plot";
          }

          return (
            <div key={plantId} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
                <h3 className="font-semibold text-gray-800 dark:text-white">{plant?.name} - {title}</h3>
              </div>
              <div className="relative w-full bg-gray-100 dark:bg-gray-900 flex-1 min-h-[300px]">
                 <PlotlyChart
                    key={`${selectedVisual}-${plantId}`} // Force remount on change
                    jsonUrl={url}
                    className="w-full h-full"
                    style={{ minHeight: 300 }}
                    hoverHighlight={isMorphology}
                  />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPhenospectral = () => {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedPlantIds.map(plantId => {
          const plant = plants.find(p => p.id === plantId);
          const url = getHeatmapUrl(plantId, selectedPhenoIndex);

          return (
            <div key={plantId} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white">{plant?.name} - {selectedPhenoIndex}</h3>
              </div>
              <div className="relative w-full bg-gray-900 flex-1 min-h-[300px] flex items-center justify-center">
                 {url ? (
                   <PlotlyChart
                      key={`pheno-${selectedPhenoIndex}-${plantId}`}
                      jsonUrl={url}
                      className="w-full h-full"
                      style={{ minHeight: 300 }}
                    />
                 ) : (
                   <div className="text-gray-500">No data available</div>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 tracking-tight mb-6">
        Comparative analysis
      </h1>
      
      <div className="space-y-8">
        {/* Selection Area */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
          
          {/* Plant Selection */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              1. Select plants to compare
            </h2>
            <div className="flex flex-wrap gap-4">
              {plants.map((p) => (
                <label key={p.id} className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all
                  ${selectedPlantIds.includes(p.id) 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500/50 dark:text-emerald-400' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'}
                `}>
                  <input
                    type="checkbox"
                    checked={selectedPlantIds.includes(p.id)}
                    onChange={() => togglePlant(p.id)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="font-medium">{p.name}</span>
                </label>
              ))}
            </div>
            {selectedPlantIds.length < 2 && (
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-500">
                Please select at least 2 plants to compare.
              </p>
            )}
          </div>

          {/* Comparison Type Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                2. Comparison Category
              </h2>
              <div className="relative">
                <select
                  value={compareType}
                  onChange={(e) => setCompareType(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow shadow-sm"
                >
                  {COMPARE_TYPES.map(({ id, label }) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Dynamic Third Dropdown */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                3. {compareType === "trends" ? "Select Metric" : compareType === "visuals" ? "Select Visual" : "Select Index"}
              </h2>
              <div className="relative">
                {compareType === "trends" && (
                  <select
                    value={selectedTrendMetric}
                    onChange={(e) => setSelectedTrendMetric(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow shadow-sm"
                  >
                    {PARAM_OPTIONS.map((o) => (
                      <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                  </select>
                )}

                {compareType === "visuals" && (
                  <select
                    value={selectedVisual}
                    onChange={(e) => setSelectedVisual(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow shadow-sm"
                  >
                    {VISUAL_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                )}

                {compareType === "phenospectral" && (
                  <select
                    value={selectedPhenoIndex}
                    onChange={(e) => setSelectedPhenoIndex(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow shadow-sm"
                  >
                    {PHENOSPECTRAL_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                )}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="mt-8">
          {selectedPlantIds.length < 2 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <Layers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Select at least two plants to view comparison</p>
            </div>
          ) : (
            <>
              {compareType === "trends" && renderTrendChart()}
              {compareType === "visuals" && renderVisuals()}
              {compareType === "phenospectral" && renderPhenospectral()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
