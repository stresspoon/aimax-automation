export default async function MarketingProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <main className="p-8 space-y-2">
      <h1 className="text-2xl font-semibold">Project: {projectId}</h1>
    </main>
  );
}


