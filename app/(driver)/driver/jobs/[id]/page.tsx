import { JobDetailSection } from "@/features/delivery/sections/JobDetailSection";

export default async function DriverJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="p-6">
      <JobDetailSection id={id} />
    </main>
  );
}
