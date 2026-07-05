import { ApplicationDetail } from "@/components/applications/ApplicationDetail";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <ApplicationDetail id={id} />
    </div>
  );
}
