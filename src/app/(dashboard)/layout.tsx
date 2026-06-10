import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { PageTransition } from "@/components/layout/PageTransition";

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
      {/* Cyberpunk cityscape background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1515630278258-321e1b1a6b8d?auto=format&fit=crop&w=1920&h=1080&q=80')",
        }}
      />
      <div className="fixed inset-0 bg-overlay" />

      <div className="relative z-[1] flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-56">
          <TopBar />
          <main className="pt-14 p-6">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
