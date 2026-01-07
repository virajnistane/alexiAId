"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { JournalEntry } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JournalEntryListProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getIntensityColor(intensity: number): string {
  const colors = [
    "bg-blue-500/20 text-blue-400",
    "bg-green-500/20 text-green-400",
    "bg-yellow-500/20 text-yellow-400",
    "bg-orange-500/20 text-orange-400",
    "bg-red-500/20 text-red-400",
  ];
  return colors[intensity - 1];
}

export function JournalEntryList({ entries, onEdit, onDelete }: JournalEntryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (entries.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-center">
            No journal entries yet. Create your first entry to start tracking your emotions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {sortedEntries.map((entry) => {
          const isExpanded = expandedId === entry.id;

          return (
            <Card
              key={entry.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {formatRelativeDate(entry.date)}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(entry.date)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entry.emotions.map((emotion) => (
                        <span
                          key={emotion}
                          className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs"
                        >
                          {emotion}
                        </span>
                      ))}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(
                          entry.intensity
                        )}`}
                      >
                        Intensity: {entry.intensity}/5
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(entry);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialogId(entry.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-4 border-t pt-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      What happened:
                    </h4>
                    <p className="text-sm">{entry.situation}</p>
                  </div>

                  {entry.thoughts && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        Thoughts:
                      </h4>
                      <p className="text-sm">{entry.thoughts}</p>
                    </div>
                  )}

                  {entry.bodySensations && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        Body sensations:
                      </h4>
                      <p className="text-sm">{entry.bodySensations}</p>
                    </div>
                  )}

                  {entry.notes && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        Additional notes:
                      </h4>
                      <p className="text-sm">{entry.notes}</p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Created: {formatDateTime(entry.createdAt)}
                    {entry.updatedAt !== entry.createdAt && (
                      <> • Updated: {formatDateTime(entry.updatedAt)}</>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialogId} onOpenChange={() => setDeleteDialogId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Journal Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteDialogId) {
                  onDelete(deleteDialogId);
                  setDeleteDialogId(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
