"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabase } from "@/lib/supabase/client";

type Counts = { total: number; selected: number; rejected: number; pending: number };

export function ProjectStats({ projectId }: { projectId: string }) {
  const [counts, setCounts] = useState<Counts>({ total: 0, selected: 0, rejected: 0, pending: 0 });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/applicants/counts?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" });
      const json = await res.json();
      if (json && json.counts) setCounts(json.counts as Counts);
    } catch {}
  }, [projectId]);

  useEffect(() => {
    refresh();
    // realtime subscription (best-effort)
    try {
      const supabase = getSupabase();
      const channel = supabase
        .channel(`applicants_counts_${projectId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "applicants", filter: `project_id=eq.${projectId}` },
          () => refresh()
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // env 미설정 시 구독 생략
    }
  }, [projectId, refresh]);

  return (
    <Card>
      <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="총 신청" value={counts.total} />
        <Stat label="선정" value={counts.selected} />
        <Stat label="미선정" value={counts.rejected} />
        <Stat label="검수대기" value={counts.pending} />
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-semibold text-[var(--fg)]">{value}</div>
      <div className="text-sm text-[var(--fg)]/70">{label}</div>
    </div>
  );
}


