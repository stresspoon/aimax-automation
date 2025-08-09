import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminToolsClient from "@/components/admin/tools-client";

export default async function AdminToolsPage() {
  const cookieStore = await cookies();
  const uid = cookieStore.get("aimax_uid")?.value;
  if (uid !== "u_1") redirect("/dashboard");
  return (
    <main className="py-8">
      <h1 className="text-2xl font-semibold mb-4">도구 관리</h1>
      <AdminToolsClient />
    </main>
  );
}


