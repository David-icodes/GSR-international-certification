"use client";

import { Clock } from "lucide-react";

export function BackendWakingBanner() {
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-amber-200 bg-amber-50">
      <div className="flex items-center gap-4 p-4">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-800">Backend is waking up</p>
          <p className="mt-0.5 text-sm text-amber-700">
            The server was idle and needs 30-60 seconds to start. Your data will load automatically.
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            </span>
            <span className="text-xs font-medium text-amber-700">Connecting...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
