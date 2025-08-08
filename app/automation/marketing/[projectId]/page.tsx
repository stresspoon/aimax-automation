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
          {/* @ts-expect-error Server/Client boundary described */}
          <BackBarWrapper />
        </div>
        <h1 className="text-2xl font-semibold">Project: {projectId}</h1>
      </div>
    </main>
  );
}

function BackBarWrapper() {
  // dynamic import locally to avoid server import issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { BackBar } = require("@/components/app/back-bar");
  return <BackBar />;
}


