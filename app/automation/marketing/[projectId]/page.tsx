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
          <BackBarWrapper />
        </div>
        <h1 className="text-2xl font-semibold">Project: {projectId}</h1>
      </div>
    </main>
  );
}

import dynamic from "next/dynamic";
const BackBar = dynamic(() => import("@/components/app/back-bar").then(m => m.BackBar), { ssr: false });

function BackBarWrapper() {
  return <BackBar />;
}


