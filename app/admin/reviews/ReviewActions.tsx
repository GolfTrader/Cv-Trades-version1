"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewActions({
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
    await fetch(`/api/admin/reviews/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2 shrink-0">
      {!approved && (
        <button
          onClick={() => handleAction("approve")}
          disabled={loading}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50 whitespace-nowrap"
        >
          ✓ Approve
        </button>
      )}
      <button
        onClick={() => handleAction("reject")}
        disabled={loading}
        className="px-4 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition disabled:opacity-50 whitespace-nowrap"
      >
        {approved ? "✕ Remove" : "✕ Reject"}
      </button>
    </div>
  );
}