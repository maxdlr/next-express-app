"use client";
import { ProtectedRoute } from "@/components/auth-provider";
import Button from "@/components/button/button";
import MultiSelectDropdown from "@/components/input/dropdown";
import Input from "@/components/input/input";
import Loader from "@/components/loader/loader";
import { ApiResponse } from "@/services/ApiService";
import { InvestFund, InvestFundService } from "@/services/InvestFundService";
import { TransactionService } from "@/services/TransactionService";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function New() {
  const [investFundData, setInvestFundData] = useState<InvestFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedInvestFunds, setSelectedInvestFunds] = useState<string[]>([]);
  const [allocations, setAllocations] = useState<{ [key: string]: number }>({});
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const investFundData = await InvestFundService.getAll();
        setInvestFundData(investFundData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------

  const send = async (formData: FormData) => {
    try {
      setPurchasing(true);
      const allocationArray = selectedInvestFunds.map((isin) => ({
        isin,
        percentage: allocations[isin] / 100 || 0,
      }));

      formData.set("allocations", JSON.stringify(allocationArray));

      const r: ApiResponse<string> = await TransactionService.deposit(formData);

      if (r.statusCode >= 400) {
        toast.error(r.message);
        return;
      }

      toast.success(r.message);
      setTimeout(() => redirect("/dashboard"), 2000);
    } catch (error) {
      setPurchasing(false);
      toast.error(error.message);
    }
  };
  return (
    <ProtectedRoute>
      <main>
        {loading ? (
          <Loader />
        ) : (
          <div className="w-full flex justify-center items-center">
            <form action={send} className="w-96 max-sm:w-full max-sm:mx-10">
              <Input
                name="amount"
                placeholder="100"
                type="number"
                onChange={(e) =>
                  setTotalAmount(parseFloat(e.target.value) || 0)
                }
              />
              <div className="grid md:grid-cols-2 grid-cols-1 md:gap-3">
                <Input name="rib" placeholder="rib" type="text" />
                <Input name="bic" placeholder="bic" type="text" />
              </div>
              <MultiSelectDropdown
                name="funds"
                options={investFundData}
                displayKey="fundName"
                valueKey="isin"
                placeholder="Choose funds"
                value={selectedInvestFunds}
                onChange={setSelectedInvestFunds}
              />

              {selectedInvestFunds.length !== 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="space-y-3">
                    {selectedInvestFunds.map((isin: string, index: number) => {
                      const fund = investFundData.find((f) => f.isin === isin);
                      const allocation = allocations[isin] || 0;
                      const allocatedAmount = (totalAmount * allocation) / 100;

                      return (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {fund?.fundName || "Unknown Fund"}
                              </h4>
                              <p className="text-sm text-gray-500 font-mono">
                                {isin}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-green-600">
                                €{allocatedAmount.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                allocated
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <input
                                type="number"
                                name={`allocation_${isin}`}
                                placeholder="0"
                                min="0"
                                max="100"
                                step="0.01"
                                value={allocation}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  setAllocations((prev) => ({
                                    ...prev,
                                    [isin]: value,
                                  }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-medium"
                              />
                            </div>
                            <div className="text-sm text-gray-500 min-w-[60px]">
                              of total
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="text-center mt-4">
                <Button
                  label={purchasing ? "Purchasing..." : "Purchase"}
                  type="submit"
                  disabled={purchasing}
                />
              </div>
            </form>
            <ToastContainer />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
