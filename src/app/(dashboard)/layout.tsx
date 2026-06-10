import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const result = await supabase.auth.getClaims();

  if (!result.data?.claims?.sub) {
    redirect("/auth");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-56">
        <TopBar />
        <main className="pt-14 p-6">{children}</main>
      </div>
    </div>
  );
}
