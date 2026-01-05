/**
 * Reusable status cards for loading, error, and info states
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, XCircle } from "lucide-react";

interface ErrorCardProps {
  title?: string;
  message: string;
}

export function ErrorCard({ title = "Error", message }: ErrorCardProps) {
  return (
    <Card className="mb-6 border-red-500/30 bg-red-500/10">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-red-300/80">{message}</CardDescription>
      </CardHeader>
    </Card>
  );
}

interface LoadingCardProps {
  message?: string;
}

export function LoadingCard({ message = "Loading..." }: LoadingCardProps) {
  return (
    <Card className="mb-6 border-blue-500/30 bg-blue-500/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          <CardTitle className="text-blue-400">{message}</CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
}

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <Card className="mb-6 border-red-500/30 bg-red-500/10">
      <CardContent className="py-3">
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red-400" />
          <p className="text-sm text-red-400">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
