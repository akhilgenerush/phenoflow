import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import { Loader2 } from "lucide-react";

const PLOTLY_CONFIG = {
  displayModeBar: false,
  responsive: true,
};

const HOVER_HIGHLIGHT_COLOR = "rgba(255, 0, 0, 0.5)";

/**
 * Renders a Plotly chart from a JSON figure (data + layout).
 * When hoverHighlight is true, the hovered segment is highlighted (half-transparent red) via React state + layout.datarevision.
 * Works for any plant/source: no graph div or Plotly.restyle needed.
 */
export default function PlotlyChart({ jsonUrl, figure: figureProp, className = "", style = {}, hoverHighlight = false }) {
  const [figure, setFigure] = useState(figureProp ?? null);
  const [loading, setLoading] = useState(Boolean(jsonUrl));
  const [error, setError] = useState(null);
  const [hoveredTrace, setHoveredTrace] = useState(null);
  const [revision, setRevision] = useState(0);
  const originalDataRef = useRef(null);

  useEffect(() => {
    if (figureProp) {
      setFigure(figureProp);
      if (figureProp?.data && Array.isArray(figureProp.data) && hoverHighlight) {
        originalDataRef.current = JSON.parse(JSON.stringify(figureProp.data));
      }
      setHoveredTrace(null);
      setLoading(false);
      return;
    }
    if (!jsonUrl) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setFigure(null);
    originalDataRef.current = null;
    setHoveredTrace(null);
    setError(null);
    fetch(jsonUrl)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((data) => {
        setFigure(data);
        const raw = data?.data;
        if (hoverHighlight && raw && Array.isArray(raw)) {
          originalDataRef.current = JSON.parse(JSON.stringify(raw));
        }
        setHoveredTrace(null);
        setError(null);
      })
      .catch((e) => setError(e?.message || "Failed to load chart"))
      .finally(() => setLoading(false));
  }, [jsonUrl, figureProp, hoverHighlight]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 ${className}`} style={{ minHeight: 200, ...style }}>
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 text-slate-500 text-sm p-4 ${className}`} style={{ minHeight: 200, ...style }}>
        {error}
      </div>
    );
  }

  if (!figure || (!figure.data && !figure.layout)) {
    return null;
  }

  const orig = originalDataRef.current;
  const displayData =
    hoverHighlight && hoveredTrace !== null && orig && Array.isArray(orig) && hoveredTrace < orig.length
      ? orig.map((t, i) =>
          i === hoveredTrace
            ? {
                ...t,
                fillcolor: HOVER_HIGHLIGHT_COLOR,
                line: { ...(t.line || {}), color: HOVER_HIGHLIGHT_COLOR, width: 2 },
              }
            : { ...t }
        )
      : figure.data;

  const layout = {
    ...figure.layout,
    autosize: true,
    width: undefined,
    height: undefined,
    margin: { t: 20, b: 20, l: 20, r: 20 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    ...(hoverHighlight && { datarevision: revision }),
    ...(hoverHighlight && {
      hoverlabel: {
        bgcolor: "rgba(255, 255, 255, 0.95)",
        bordercolor: "#ccc",
        font: { color: "#1f2937", family: "inherit", size: 13 },
      },
    }),
  };

  const handleHover = (ev) => {
    if (!hoverHighlight || !ev?.points?.[0]) return;
    const curveNumber = ev.points[0].curveNumber;
    if (!orig || !Array.isArray(orig) || curveNumber >= orig.length) return;
    setHoveredTrace(curveNumber);
    setRevision((r) => r + 1);
  };

  const handleUnhover = () => {
    if (!hoverHighlight) return;
    setHoveredTrace(null);
    setRevision((r) => r + 1);
  };

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <Plot
          key={typeof jsonUrl === "string" ? jsonUrl : (figure?.data?.length ?? 0)}
          data={displayData}
          layout={layout}
          config={PLOTLY_CONFIG}
          useResizeHandler
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
          onHover={hoverHighlight ? handleHover : undefined}
          onUnhover={hoverHighlight ? handleUnhover : undefined}
        />
      </div>
    </div>
  );
}
