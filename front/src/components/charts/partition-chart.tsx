"use client";

import { PortfolioEvolutionPoint } from "@/services/GraphService";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

export default function PartitionChart(data: PortfolioEvolutionPoint[]) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Epargne totale</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis type="number" domain={["dataMin - 20", "dataMax + 20"]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
