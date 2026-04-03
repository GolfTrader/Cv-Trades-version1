"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApproveRejectButtons({
  id,
  approved,
}: {
  id: string;
  approved: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(action: "approve" | "reject") {
    setLoading(true);
    await fetch(`/api/admin/listings/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-3">
      {!approved ? (
        <button
          onClick={() => handleAction("approve")}
          disabled={loading}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Saving…" : "✓  Approve Listing"}
        </button>
      ) : (
        <button
          onClick={() => handleAction("reject")}
          disabled={loading}
          className="px-5 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Saving…" : "✕  Remove from Live"}
        </button>
      )}
    </div>
  );
}