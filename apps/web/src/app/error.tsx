"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Something Failed</h1>
        <p className="text-muted-foreground mb-6">
          The operation could not be completed. Try again or contact support if this persists.
        </p>
        <Button
          onClick={reset}
          className="btn-elegant"
        >
          Execute Again
        </Button>
        <p className="text-xs text-muted-foreground mt-6">
          Execute. Build. Lead.
        </p>
      </div>
    </div>
  );
}
