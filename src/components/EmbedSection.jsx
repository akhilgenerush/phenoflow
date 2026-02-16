import React, { useRef } from "react";
import { Leaf, Scan, Maximize2 } from "lucide-react";
import PlotlyChart from "./PlotlyChart";

// JSON figure URLs – per plant from plant 1/, plant 2/, plant 3/ dirs
import leavesMorphologyPlant1Url from "../assets/plant 1/leaves_morphology.json?url";
import leavesMorphologyPlant2Url from "../assets/plant 2/leaves_morphology.json?url";
import leavesMorphologyPlant3Url from "../assets/plant 3/leaves_morphology.json?url";
import plantLidarPlant1Url from "../assets/plant 1/plant_lidar_data.json?url";
import plantLidarPlant2Url from "../assets/plant 2/plant_lidar_data.json?url";
import plantLidarPlant3Url from "../assets/plant 3/plant_lidar_data.json?url";

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

const EMBED_HEIGHT = 420;

function EmbedCard({ title, icon: Icon, jsonUrl, hoverHighlight = false }) {
  const containerRef = useRef(null);

  const openFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
        <button
          type="button"
          onClick={openFullscreen}
          className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={`Fullscreen ${title}`}
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">{title}</h3>
      </div>
      <div
        ref={containerRef}
        className="relative w-full bg-gray-100 dark:bg-gray-900 overflow-hidden group"
        style={{ height: EMBED_HEIGHT }}
      >
        <style>{`
          /* When in fullscreen, override the fixed height style */
          :fullscreen > div {
            height: 100% !important;
          }
          /* Webkit fallback */
          :-webkit-full-screen > div {
            height: 100% !important;
          }
        `}</style>
        <PlotlyChart
          jsonUrl={jsonUrl}
          className="h-full"
          hoverHighlight={hoverHighlight}
        />
      </div>
    </div>
  );
}

export default function EmbedSection({ selectedPlantId = "plant-1" }) {
  const leavesMorphologyUrl = LEAVES_MORPHOLOGY_BY_PLANT_ID[selectedPlantId] ?? leavesMorphologyPlant1Url;
  const plantLidarUrl = PLANT_LIDAR_BY_PLANT_ID[selectedPlantId] ?? plantLidarPlant1Url;
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Structural analytics</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <EmbedCard
          key={`morph-${selectedPlantId}`}
          title="Leaf morphology (dimensions)"
          icon={Leaf}
          jsonUrl={leavesMorphologyUrl}
          hoverHighlight
        />
        <EmbedCard
          key={`lidar-${selectedPlantId}`}
          title="3D Plant"
          icon={Scan}
          jsonUrl={plantLidarUrl}
        />
      </div>
    </section>
  );
}
