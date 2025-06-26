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

export default function EvolutionChart(data: PortfolioEvolutionPoint[]) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Epargne totale</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis type="number" domain={["dataMin - 10", "dataMax + 10"]} />
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
