import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Compass className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-muted-foreground mb-2">404</h1>
        <h2 className="text-2xl font-semibold">Lost?</h2>
        <p className="mt-4 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Return to base and try again.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button className="btn-elegant">
            Return Home
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground mt-8">
          Execute. Build. Lead.
        </p>
      </div>
    </div>
  );
}
