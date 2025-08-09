"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

type Tool = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  badge?: string | null;
  price_cents: number;
  currency: string;
  is_active: boolean;
  icon_url?: string | null;
};

export default function AdminToolsClient() {
  const [items, setItems] = useState<Tool[]>([]);
  const [editing, setEditing] = useState<Tool | null>(null);

  async function load() {
    const res = await fetch("/api/admin/catalog/tools", { cache: "no-store" });
    const json = await res.json();
    setItems(json.items ?? []);
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ slug: "", title: "", subtitle: "", badge: "", price_cents: 0, currency: "KRW", is_active: false, icon_url: "" });
  }

  async function save() {
    if (!editing) return;
    const res = await fetch("/api/admin/catalog/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      toast.success("저장되었습니다");
      setEditing(null);
      load();
    } else {
      toast.error("저장 실패");
    }
  }

  async function remove(slug: string) {
    const res = await fetch(`/api/admin/catalog/tools?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("삭제되었습니다");
      load();
    } else {
      toast.error("삭제 실패");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Button onClick={startNew} className="bg-[var(--accent)] text-[var(--bg)]">신규 추가</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((t) => (
          <Card key={t.slug}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-[var(--fg)]/70">{t.slug}</div>
              </div>
              <div className="text-sm text-[var(--fg)]/70">{t.subtitle}</div>
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" onClick={() => setEditing(t)}>수정</Button>
                <Button variant="secondary" onClick={() => remove(t.slug)}>삭제</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editing && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="slug"><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="title"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="subtitle"><Input value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></Field>
              <Field label="badge"><Input value={editing.badge ?? ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} /></Field>
              <Field label="price"><Input type="number" value={editing.price_cents} onChange={(e) => setEditing({ ...editing, price_cents: Number(e.target.value || 0) })} /></Field>
              <Field label="currency"><Input value={editing.currency} onChange={(e) => setEditing({ ...editing, currency: e.target.value })} /></Field>
              <Field label="icon_url"><Input value={editing.icon_url ?? ""} onChange={(e) => setEditing({ ...editing, icon_url: e.target.value })} /></Field>
              <div className="flex items-center gap-2 text-sm">
                <input id="active" type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
                <label htmlFor="active">is_active</label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>취소</Button>
              <Button className="bg-[var(--accent)] text-[var(--bg)]" onClick={save}>저장</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-[var(--fg)]/70">{label}</span>
      {children}
    </label>
  );
}


