import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CanvasBackground } from "@/components/canvas/CanvasBackground";

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
    <div className="relative min-h-screen">
      <CanvasBackground />
      <div className="flex min-h-screen relative z-[1]">
        <Sidebar />
        <div className="flex-1 ml-56">
          <TopBar />
          <main className="pt-14 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
