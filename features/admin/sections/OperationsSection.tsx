"use client";

import { SimulateTimePanel } from "../components/SimulateTimePanel";
import { OverdueTable } from "../components/OverdueTable";
import { useTimeSimulation } from "../hooks/useTimeSimulation";

export function OperationsSection() {
  const {
    overdueOrders,
    isLoadingOverdue,
    isSimulating,
    isProcessing,
    simulateMessage,
    processMessage,
    error,
    simulateNextDay,
    processLateOrders,
  } = useTimeSimulation();

  return (
    <div className="flex flex-col gap-6">
      <SimulateTimePanel
        onSimulateNextDay={simulateNextDay}
        onProcessLateOrders={processLateOrders}
        isSimulating={isSimulating}
        isProcessing={isProcessing}
        simulateMessage={simulateMessage}
        processMessage={processMessage}
        error={error}
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#191c1e]">
            Pesanan Overdue
            {overdueOrders.length > 0 && (
              <span className="ml-2 rounded-full bg-[#cc4636]/10 px-2 py-0.5 text-xs font-medium text-[#cc4636]">
                {overdueOrders.length}
              </span>
            )}
          </p>
        </div>
        <OverdueTable orders={overdueOrders} isLoading={isLoadingOverdue} />
      </div>
    </div>
  );
}
