import React from "react";
import { INDEX_CATEGORY, CATEGORY_LABELS } from "../data/heatmapCategories";
import { INDEX_FULL_FORM, INDEX_FAQ, INDEX_RANGE } from "../data/spectralIndexFAQ";

export default function FAQsPage() {
  const categories = Object.keys(INDEX_CATEGORY);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 tracking-tight mb-6">
        FAQs — Spectral indices
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Full form, plain-language description (plant health only), and defined range for each index.
      </p>
      <div className="space-y-10">
        {categories.map((catKey) => (
          <section key={catKey}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {CATEGORY_LABELS[catKey] ?? catKey}
            </h2>
            <div className="space-y-6">
              {(INDEX_CATEGORY[catKey] ?? []).map((abbr) => {
                const fullForm = INDEX_FULL_FORM[abbr];
                const description = INDEX_FAQ[abbr];
                const range = INDEX_RANGE[abbr];
                return (
                  <div
                    key={abbr}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 text-lg">
                      {fullForm ? `${fullForm} (${abbr})` : abbr}
                    </h3>
                    {description && (
                      <p className="mt-2 text-slate-600 dark:text-slate-300">
                        {description}
                      </p>
                    )}
                    {range && (
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-medium">Defined range:</span> {range}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
