"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const [cookies, setCookies] = useState("");
  const [sessionInfo, setSessionInfo] = useState("loading...");
  const supabase = createClient();

  useEffect(() => {
    setCookies(document.cookie);
    supabase.auth.getSession().then(({ data }) => {
      setSessionInfo(
        data?.session
          ? `User: ${data.session.user.email}, expires: ${data.session.expires_at}`
          : "No session",
      );
    });
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="text-xl font-bold mb-4">Auth Debug</h1>
      <div className="mb-4">
        <strong>document.cookie:</strong>
        <pre className="bg-gray-100 p-2 rounded mt-1 break-all whitespace-pre-wrap">
          {cookies || "(empty)"}
        </pre>
      </div>
      <div className="mb-4">
        <strong>getSession():</strong>
        <pre className="bg-gray-100 p-2 rounded mt-1">{sessionInfo}</pre>
      </div>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
