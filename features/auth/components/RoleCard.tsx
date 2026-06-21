import { LucideIcon, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  role: string;
  label: string;
  description: string;
  Icon: LucideIcon;
  isLoading?: boolean;
  onSelect: () => void;
};

export function RoleCard({ label, description, Icon, isLoading, onSelect }: Props) {
  return (
    <Card
      onClick={!isLoading ? onSelect : undefined}
      className={`group relative flex flex-col items-center gap-4 p-6 cursor-pointer border-2 border-[#bcc9c6]/60 bg-white text-center transition-all duration-200 hover:border-[#00685f] hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] ${
        isLoading ? "opacity-70 cursor-wait" : ""
      }`}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#00685f]/8 text-[#00685f] group-hover:bg-[#00685f]/15 transition-colors">
        {isLoading ? (
          <Loader2 size={26} className="animate-spin" />
        ) : (
          <Icon size={26} />
        )}
      </div>
      <div>
        <p className="font-semibold text-[#191c1e] text-base">{label}</p>
        <p className="text-sm text-[#3d4947] mt-1 leading-snug">{description}</p>
      </div>
    </Card>
  );
}
