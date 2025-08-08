export default async function MarketingProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <main className="py-8 space-y-4">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="mb-2">
          {/* client back bar */}
          <BackBarClient />
        </div>
        <h1 className="text-2xl font-semibold">Project: {projectId}</h1>
      </div>
    </main>
  );
}

import BackBarClient from "@/components/app/back-bar-client";


