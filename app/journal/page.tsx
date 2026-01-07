"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/app/auth/AuthContext";
import { useAppStore } from "@/lib/store";
import { JournalEntryForm } from "./JournalEntryForm";
import { JournalEntryList } from "./JournalEntryList";
import type { JournalEntry } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function JournalPage() {
  const { currentUser } = useAuth();
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useAppStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const userId =
    currentUser?.type === "local" ? currentUser.user.id : currentUser?.user.uid || "";
  const userEntries = journalEntries.filter((entry: JournalEntry) => entry.userId === userId);

  const handleSave = (data: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => {
    if (editingEntry) {
      updateJournalEntry(editingEntry.id, data);
    } else {
      addJournalEntry({ ...data, userId });
    }
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Emotion Journal"
        description="Track your emotions, thoughts, and experiences to build self-awareness"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Your Entries</h2>
            <p className="text-muted-foreground text-sm">
              {userEntries.length} {userEntries.length === 1 ? "entry" : "entries"}
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>

        <JournalEntryList
          entries={userEntries}
          onEdit={handleEdit}
          onDelete={deleteJournalEntry}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleCancel}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? "Edit Journal Entry" : "New Journal Entry"}
            </DialogTitle>
          </DialogHeader>
          <JournalEntryForm
            entry={editingEntry || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
