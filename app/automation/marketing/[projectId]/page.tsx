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
        <h1 className="text-2xl font-semibold mb-3">Project: {projectId}</h1>
        {/* live stats */}
        {/* @ts-expect-error Client component import wrapper */}
        <ProjectStatsWrapper projectId={projectId} />
        {/* actions */}
        {/* @ts-expect-error Client component import wrapper */}
        <ProjectActionsWrapper projectId={projectId} />
        {/* tabs */}
        {/* @ts-expect-error Client component import wrapper */}
        <ProjectTabsWrapper projectId={projectId} />
      </div>
    </main>
  );
}

import BackBarClient from "@/components/app/back-bar-client";

function ProjectStatsWrapper({ projectId }: { projectId: string }) {
  // dynamic import of client stats
  const Comp = require("@/components/marketing/project-stats").ProjectStats as React.ComponentType<{ projectId: string }>;
  return <Comp projectId={projectId} />;
}

function ProjectActionsWrapper({ projectId }: { projectId: string }) {
  const Comp = require("@/components/marketing/project-actions").ProjectActions as React.ComponentType<{ projectId: string }>;
  return <Comp projectId={projectId} />;
}

function ProjectTabsWrapper({ projectId }: { projectId: string }) {
  const Comp = require("@/components/marketing/project-tabs").ProjectTabs as React.ComponentType<{ projectId: string; projectName: string }>; 
  return <Comp projectId={projectId} projectName={`Project ${projectId}`} />;
}


