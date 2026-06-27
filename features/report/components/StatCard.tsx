type Props = {
  label: string;
  value: string;
  hint?: string;
};

export function StatCard({ label, value, hint }: Props) {
  return (
    <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5 flex flex-col gap-1">
      <p className="text-xs text-[#6d7a77] font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-[#191c1e]">{value}</p>
      {hint && <p className="text-xs text-[#6d7a77]">{hint}</p>}
    </div>
  );
}
