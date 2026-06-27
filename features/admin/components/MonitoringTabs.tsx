import { MonitoringTab } from "../hooks/useMonitoring";

type Tab = { key: MonitoringTab; label: string };

const TABS: Tab[] = [
  { key: "users", label: "Users" },
  { key: "stores", label: "Stores" },
  { key: "products", label: "Products" },
  { key: "orders", label: "Orders" },
  { key: "vouchers", label: "Vouchers" },
  { key: "promos", label: "Promos" },
  { key: "deliveries", label: "Deliveries" },
  { key: "overdue", label: "Overdue" },
];

type Props = {
  active: MonitoringTab;
  onChange: (tab: MonitoringTab) => void;
};

export function MonitoringTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            active === tab.key
              ? "bg-[#00685f] text-white"
              : "text-[#6d7a77] hover:bg-[#f2f4f6] hover:text-[#191c1e]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
