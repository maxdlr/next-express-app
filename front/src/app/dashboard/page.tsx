"use client";
import { ProtectedRoute } from "@/components/auth-provider";
import EvolutionChart from "@/components/charts/evolution-chart";
import PartitionChart from "@/components/charts/partition-chart";
import {
  GraphService,
  PortfolioEvolutionPoint,
  PortfolioPartition,
} from "@/services/GraphService";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [evolutionData, setEvolutionData] = useState<PortfolioEvolutionPoint[]>(
    [],
  );
  const [partitionData, setPartitionData] = useState<PortfolioPartition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const evolutionData = await GraphService.getEvolutionData();
        const partitionData = await GraphService.getPartitionData();
        setEvolutionData(evolutionData);
        setPartitionData(partitionData);
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
          <div>
            <EvolutionChart data={evolutionData} />
            <PartitionChart data={partitionData} />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
