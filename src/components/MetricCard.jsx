import React from "react";

const MetricCard = ({ title, value, unit, icon: Icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {value} {unit}
        </h2>
      </div>
      <Icon className="text-green-600 dark:text-green-500 w-8 h-8" />
    </div>
  );
};

export default MetricCard;
