import BackBarClient from "@/components/app/back-bar-client";
import ProjectStatsClient from "@/components/marketing/project-stats-client";
import ProjectActionsClient from "@/components/marketing/project-actions-client";
import ProjectTabsClient from "@/components/marketing/project-tabs-client";
import ProjectSyncClient from "@/components/marketing/project-sync-client";

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
        <ProjectStatsClient projectId={projectId} />
        {/* actions */}
        <ProjectActionsClient projectId={projectId} />
        {/* tabs */}
        <ProjectTabsClient projectId={projectId} projectName={`Project ${projectId}`} />
        {/* sheet sync */}
        <ProjectSyncClient projectId={projectId} />
      </div>
    </main>
  );
}


