/**
 * Multi-plant sample data for dashboard.
 */
const buildTrends = (daily) =>
  daily.map((d) => ({
    day: d.day,
    height: d.height,
    biomass: d.biomass,
    leafTemp: d.leafTemp,
    growthRate: d.growthRate,
  }));

export const plants = [
  {
    id: "plant-1",
    name: "Plant 1",
    metrics: { leafTemperature: 32.5, plantHeight: 52, biomass: 135, growthRate: 2.5 },
    dailyData: [
      { day: "D1", height: 30, biomass: 80, leafTemp: 31.2, humidity: 60, growthRate: 2.2 },
      { day: "D2", height: 34, biomass: 90, leafTemp: 31.5, humidity: 62, growthRate: 2.4 },
      { day: "D3", height: 39, biomass: 100, leafTemp: 31.8, humidity: 61, growthRate: 2.6 },
      { day: "D4", height: 43, biomass: 110, leafTemp: 32.1, humidity: 63, growthRate: 2.5 },
      { day: "D5", height: 46, biomass: 118, leafTemp: 32.4, humidity: 65, growthRate: 2.4 },
      { day: "D6", height: 49, biomass: 125, leafTemp: 32.6, humidity: 64, growthRate: 2.5 },
      { day: "D7", height: 52, biomass: 135, leafTemp: 32.5, humidity: 66, growthRate: 2.5 },
    ],
  },
  {
    id: "plant-2",
    name: "Plant 2",
    metrics: { leafTemperature: 30.8, plantHeight: 48, biomass: 118, growthRate: 2.1 },
    dailyData: [
      { day: "D1", height: 28, biomass: 72, leafTemp: 30.1, humidity: 58, growthRate: 1.9 },
      { day: "D2", height: 31, biomass: 80, leafTemp: 30.3, humidity: 59, growthRate: 2.0 },
      { day: "D3", height: 35, biomass: 88, leafTemp: 30.5, humidity: 60, growthRate: 2.2 },
      { day: "D4", height: 39, biomass: 96, leafTemp: 30.6, humidity: 61, growthRate: 2.1 },
      { day: "D5", height: 42, biomass: 104, leafTemp: 30.7, humidity: 62, growthRate: 2.0 },
      { day: "D6", height: 45, biomass: 111, leafTemp: 30.8, humidity: 63, growthRate: 2.1 },
      { day: "D7", height: 48, biomass: 118, leafTemp: 30.8, humidity: 64, growthRate: 2.1 },
    ],
  },
  {
    id: "plant-3",
    name: "Plant 3",
    metrics: { leafTemperature: 33.2, plantHeight: 55, biomass: 142, growthRate: 2.8 },
    dailyData: [
      { day: "D1", height: 32, biomass: 85, leafTemp: 32.0, humidity: 62, growthRate: 2.6 },
      { day: "D2", height: 36, biomass: 95, leafTemp: 32.3, humidity: 63, growthRate: 2.7 },
      { day: "D3", height: 41, biomass: 105, leafTemp: 32.6, humidity: 64, growthRate: 2.8 },
      { day: "D4", height: 45, biomass: 116, leafTemp: 32.9, humidity: 65, growthRate: 2.9 },
      { day: "D5", height: 49, biomass: 126, leafTemp: 33.1, humidity: 66, growthRate: 2.8 },
      { day: "D6", height: 52, biomass: 134, leafTemp: 33.2, humidity: 65, growthRate: 2.7 },
      { day: "D7", height: 55, biomass: 142, leafTemp: 33.2, humidity: 66, growthRate: 2.8 },
    ],
  },
];
plants.forEach((p) => { p.trends = buildTrends(p.dailyData); });

export const plantData = plants[0];
