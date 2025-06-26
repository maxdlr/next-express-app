"use client";

import { ProtectedRoute } from "@/components/auth-provider";
import { Allocation, AllocationService } from "@/services/AllocationService";
import { useState, useEffect } from "react";

export default function TransactionDetail() {
  const id = window.location.pathname.substring("/transaction/".length);

  const [allocationData, setAllocationData] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allocationData =
          await AllocationService.getAllByTransactionId(id);
        setAllocationData(allocationData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalAllocatedAmount =
    allocationData[0]?.allocatedAmount.toFixed(2) || 0;
  const transactionIdentifier = allocationData[0]?.transactionId || "N/A";

  return (
    <ProtectedRoute>
      <main>
        {loading ? (
          <div>loading allocations...</div>
        ) : (
          <div className="min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">
                Transaction Details{" "}
                <span className="text-[#7700ff]">{transactionIdentifier}</span>
              </h1>

              <div className="mb-8">
                <p className="text-xl text-gray-700">
                  Montant total:{" "}
                  <span className="font-semibold text-green-600">
                    {totalAllocatedAmount} €
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allocationData.map((item) => (
                  <div
                    key={item._id}
                    className="bg-purple-50 p-5 rounded-lg shadow-sm border border-purple-200"
                  >
                    <p className="text-lg text-gray-700 mb-1">
                      <span className="font-medium">ISIN:</span> {item.isin}
                    </p>
                    <p className="text-lg mb-1">
                      <span className="font-medium text-gray-700">
                        Percentage:
                      </span>{" "}
                      <span className="text-[#7700ff] font-bold">
                        {(item.percentage * 100).toFixed(2)}%
                      </span>
                    </p>
                    <p className="text-lg text-gray-700 mb-1">
                      <span className="font-medium">Purchased Share:</span>{" "}
                      {item.purchasedShare.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
