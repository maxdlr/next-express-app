"use client";
import { ProtectedRoute } from "@/components/auth-provider";
import EvolutionChart from "@/components/charts/evolution-chart";
import { GraphService, PortfolioEvolutionPoint } from "@/services/GraphService";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<PortfolioEvolutionPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const evolutionData = await GraphService.getEvolutionData();
        setData(evolutionData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <main>
        {loading ? (
          <div>Loading chart data...</div>
        ) : (
          <EvolutionChart data={data} />
        )}
      </main>
    </ProtectedRoute>
  );
}
