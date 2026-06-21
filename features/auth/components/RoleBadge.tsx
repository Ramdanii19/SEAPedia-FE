import { Role } from "@/features/auth/types/auth.types";

const ROLE_STYLE: Record<Role, { bg: string; text: string; label: string }> = {
  BUYER:  { bg: "bg-[#bee5fd]", text: "text-[#244b5f]", label: "Pembeli" },
  SELLER: { bg: "bg-[#89f5e7]", text: "text-[#00201d]", label: "Penjual" },
  DRIVER: { bg: "bg-[#ffdad4]", text: "text-[#410000]", label: "Pengemudi" },
  ADMIN:  { bg: "bg-[#e8e0f0]", text: "text-[#21005d]", label: "Admin" },
};

type Props = {
  role: Role;
  active?: boolean;
};

export function RoleBadge({ role, active }: Props) {
  const style = ROLE_STYLE[role] ?? { bg: "bg-gray-100", text: "text-gray-700", label: role };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} ${
        active ? "ring-2 ring-offset-1 ring-[#00685f]" : ""
      }`}
    >
      {active && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#00685f] shrink-0" />
      )}
      {style.label}
      {active && <span className="opacity-70 font-normal">(aktif)</span>}
    </span>
  );
}
