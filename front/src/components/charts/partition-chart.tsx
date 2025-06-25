"use client";

import { PortfolioPartition } from "@/services/GraphService";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function PartitionChart(data: PortfolioPartition[]) {
  console.log(data.data);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Epargne totale</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart width={730} height={750}>
            <Tooltip payload={[{ name: "05-01", value: 12, unit: "kg" }]} />
            <Legend
              payload={[{ value: "Allocations", type: "line", id: "ID01" }]}
            />
            <Pie
              data={data.data}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
