/**
 * Local Store Editor Component
 *
 * A JSON editor for viewing and modifying the Zustand store state.
 * Useful for debugging and testing during development.
 *
 * Note: Excludes `sessionDetails` from the editor to reduce noise.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore, type AppState } from "@/lib/store";
import { Database, Save, Check, RefreshCw } from "lucide-react";

export function LocalStoreEditor() {
  // Subscribe to individual store fields (excludes sessionDetails)
  const user = useAppStore((s) => s.user);
  const userPersonalityType = useAppStore((s) => s.userPersonalityType);
  const userPersonalityAssessment = useAppStore((s) => s.userPersonalityAssessment);
  const userPersonalitySessionId = useAppStore((s) => s.userPersonalitySessionId);
  const assessmentSessions = useAppStore((s) => s.assessmentSessions);
  const coachSessions = useAppStore((s) => s.coachSessions);
  const setRawState = useAppStore((s) => s.setRawState);

  const [storeJson, setStoreJson] = useState("");
  const [storeError, setStoreError] = useState<string | null>(null);
  const [storeSaved, setStoreSaved] = useState(false);

  /** Creates a JSON snapshot of the relevant store fields */
  const getStoreSnapshot = useCallback(() => {
    return JSON.stringify(
      {
        user,
        userPersonalityType,
        userPersonalityAssessment,
        userPersonalitySessionId,
        assessmentSessions,
        coachSessions,
      },
      null,
      2
    );
  }, [
    user,
    userPersonalityType,
    userPersonalityAssessment,
    userPersonalitySessionId,
    assessmentSessions,
    coachSessions,
  ]);

  // Sync store changes to the textarea
  useEffect(() => {
    setStoreJson(getStoreSnapshot());
  }, [getStoreSnapshot]);

  /** Saves the edited JSON back to the store */
  const handleSave = () => {
    try {
      const parsed = JSON.parse(storeJson) as Partial<AppState>;
      setRawState(parsed);
      setStoreError(null);
      setStoreSaved(true);
      setTimeout(() => setStoreSaved(false), 2000);
    } catch (err) {
      setStoreError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  /** Resets the textarea to the current store state */
  const handleReset = () => {
    setStoreJson(getStoreSnapshot());
    setStoreError(null);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-teal-400" />
            <CardTitle>Local Store Editor</CardTitle>
          </div>
          <Button
            onClick={handleSave}
            disabled={storeSaved}
            size="sm"
            className="bg-teal-600 hover:bg-teal-700"
          >
            {storeSaved ? <Check className="h-4 w-4 mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            {storeSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {storeError ? <JsonErrorDisplay message={storeError} /> : null}
        <textarea
          value={storeJson}
          onChange={(e) => setStoreJson(e.target.value)}
          className="w-full h-60 font-mono text-xs p-4 bg-background border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          spellCheck={false}
        />
        <div className="mt-2 flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

/** Displays JSON parse error message */
function JsonErrorDisplay({ message }: { message: string }) {
  return (
    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
}
