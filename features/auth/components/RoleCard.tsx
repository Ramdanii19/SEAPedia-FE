import { LucideIcon, CheckCircle } from "lucide-react";

type Props = {
  role: string;
  label: string;
  description: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  isSelected: boolean;
  onSelect: () => void;
};

export function RoleCard({ label, description, Icon, iconBg, iconColor, isSelected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-col items-center text-center p-8 rounded-xl border-2 transition-all duration-300 cursor-pointer group
        ${isSelected
          ? "border-[#006a61] bg-[#f4fffc] shadow-[0px_12px_32px_rgba(15,58,77,0.1)] -translate-y-1"
          : "border-[#bcc9c6]/30 bg-white hover:-translate-y-2 hover:shadow-md"
        }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.175,0.885,0.32,1.275)" }}
    >
      {/* Checkmark */}
      <div
        className={`absolute top-4 right-4 transition-all duration-300 ${
          isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        <CheckCircle size={22} className="text-[#008378]" fill="#008378" color="white" />
      </div>

      {/* Icon circle */}
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 transition-colors duration-300 ${
          isSelected ? "bg-[#008378]! text-white!" : ""
        }`}
        style={{ backgroundColor: isSelected ? undefined : iconBg, color: isSelected ? undefined : iconColor }}
      >
        <Icon size={36} />
      </div>

      <h3 className="text-xl font-semibold text-[#191c1e] mb-2">{label}</h3>
      <p className="text-sm text-[#3d4947] leading-relaxed">{description}</p>
    </button>
  );
}
