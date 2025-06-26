"use client";
import { ProtectedRoute } from "@/components/auth-provider";
import EvolutionChart from "@/components/charts/evolution-chart";
import PartitionChart from "@/components/charts/partition-chart";
import Transactions from "@/components/datatables/transactions";
import {
  DatatableService,
  FormattedTransaction,
} from "@/services/DatatableService";
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
  const [transactionData, setFormattedTransactionData] = useState<
    FormattedTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const evolutionData = await GraphService.getEvolutionData();
        const partitionData = await GraphService.getPartitionData();
        const transactionData = await DatatableService.getAllTransactions();
        setEvolutionData(evolutionData);
        setPartitionData(partitionData);
        setFormattedTransactionData(transactionData);
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
          <section>
            <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 grid-flow-row gap-3">
              <div className="lg:col-span-1 col-span-full">
                <PartitionChart data={partitionData} />
              </div>
              <div className="lg:col-span-2 col-span-full">
                <EvolutionChart data={evolutionData} />
              </div>
              <div className="lg:col-span-3 col-span-full">
                <Transactions data={transactionData} />
              </div>
            </div>
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
}
