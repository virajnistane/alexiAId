/**
 * Analysis Results Card Component
 *
 * Displays the results of a session analysis, including summary and raw JSON.
 * Handles both success and error states.
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type SessionAnalysis } from "@/lib/ttai";
import { FileText } from "lucide-react";

interface AnalysisResultsCardProps {
  /** Analysis result data, or null if not available */
  result: SessionAnalysis | null;
  /** Error message if analysis failed */
  error: string | null;
}

export function AnalysisResultsCard({ result, error }: AnalysisResultsCardProps) {
  return (
    <Card className="mb-6 bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-400" />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? <ErrorDisplay message={error} /> : null}
        {result ? <ResultDisplay result={result} /> : null}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

/** Displays error message in a styled container */
function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
      <p className="text-red-400">{message}</p>
    </div>
  );
}

/** Displays analysis result with expandable JSON view */
function ResultDisplay({ result }: { result: SessionAnalysis }) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">{result.summary}</p>
      <details>
        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
          View raw JSON
        </summary>
        <pre className="mt-2 p-4 bg-background rounded-lg border border-border text-xs overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </div>
  );
}
