import React, { useMemo, useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight, Download } from "lucide-react";

const ROWS_PER_PAGE = 7;

export default function DataTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: "day", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(
    () =>
      [...(data ?? [])].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }),
    [data, sortConfig]
  );

  const filteredData = useMemo(
    () =>
      sortedData.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [sortedData, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const pageIndex = Math.min(currentPage, totalPages);
  const paginatedData = useMemo(
    () => filteredData.slice((pageIndex - 1) * ROWS_PER_PAGE, pageIndex * ROWS_PER_PAGE),
    [filteredData, pageIndex]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, data?.length]);

  const requestSort = (key) => {
    setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc" });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="inline-block w-4 h-4" /> : <ChevronDown className="inline-block w-4 h-4" />;
  };

  const downloadCSV = () => {
    if (!sortedData.length) return;
    const headers = Object.keys(sortedData[0]).join(",");
    const rows = sortedData.map((row) => Object.values(row).join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plant_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startRow = (pageIndex - 1) * ROWS_PER_PAGE + 1;
  const endRow = Math.min(pageIndex * ROWS_PER_PAGE, filteredData.length);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Daily plant data</h2>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700/80 text-left">
              <th className="p-3 cursor-pointer text-gray-700 dark:text-gray-300" onClick={() => requestSort("day")}>Day {getSortIcon("day")}</th>
              <th className="p-3 cursor-pointer text-gray-700 dark:text-gray-300" onClick={() => requestSort("height")}>Height (cm) {getSortIcon("height")}</th>
              <th className="p-3 cursor-pointer text-gray-700 dark:text-gray-300" onClick={() => requestSort("biomass")}>Biomass (g) {getSortIcon("biomass")}</th>
              <th className="p-3 cursor-pointer text-gray-700 dark:text-gray-300" onClick={() => requestSort("leafTemp")}>Leaf temp (°C) {getSortIcon("leafTemp")}</th>
              <th className="p-3 cursor-pointer text-gray-700 dark:text-gray-300" onClick={() => requestSort("growthRate")}>Growth rate {getSortIcon("growthRate")}</th>
              <th className="p-3 cursor-pointer text-gray-700 dark:text-gray-300" onClick={() => requestSort("humidity")}>Humidity (%) {getSortIcon("humidity")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.day} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="p-3 text-gray-800 dark:text-gray-200">{row.day}</td>
                <td className="p-3 text-gray-800 dark:text-gray-200">{row.height}</td>
                <td className="p-3 text-gray-800 dark:text-gray-200">{row.biomass}</td>
                <td className="p-3 text-gray-800 dark:text-gray-200">{row.leafTemp}</td>
                <td className="p-3 text-gray-800 dark:text-gray-200">{row.growthRate}</td>
                <td className="p-3 text-gray-800 dark:text-gray-200">{row.humidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredData.length === 0 ? 0 : startRow}–{endRow} of {filteredData.length} rows
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={pageIndex <= 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[6rem] text-center">Page {pageIndex} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageIndex >= totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
