"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import type { JournalEntry } from "@/lib/store";

const COMMON_EMOTIONS = [
  "Happy", "Sad", "Angry", "Anxious", "Excited",
  "Calm", "Frustrated", "Confused", "Grateful", "Lonely",
  "Proud", "Ashamed", "Surprised", "Bored", "Content",
  "Overwhelmed", "Hopeful", "Disappointed", "Relaxed", "Scared"
];

interface JournalEntryFormProps {
  entry?: JournalEntry;
  onSave: (data: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function JournalEntryForm({ entry, onSave, onCancel }: JournalEntryFormProps) {
  const [date, setDate] = useState(
    entry?.date ? new Date(entry.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(entry?.emotions || []);
  const [customEmotion, setCustomEmotion] = useState("");
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(entry?.intensity || 3);
  const [situation, setSituation] = useState(entry?.situation || "");
  const [thoughts, setThoughts] = useState(entry?.thoughts || "");
  const [bodySensations, setBodySensations] = useState(entry?.bodySensations || "");
  const [notes, setNotes] = useState(entry?.notes || "");

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const addCustomEmotion = () => {
    if (customEmotion.trim() && !selectedEmotions.includes(customEmotion.trim())) {
      setSelectedEmotions([...selectedEmotions, customEmotion.trim()]);
      setCustomEmotion("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEmotions.length === 0) {
      alert("Please select at least one emotion");
      return;
    }

    if (!situation.trim()) {
      alert("Please describe what happened");
      return;
    }

    onSave({
      userId: entry?.userId || "",
      date: new Date(date).toISOString(),
      emotions: selectedEmotions,
      intensity,
      situation: situation.trim(),
      thoughts: thoughts.trim(),
      bodySensations: bodySensations.trim(),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date and Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">When did this happen?</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </CardContent>
      </Card>

      {/* Emotions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What emotions did you feel?</CardTitle>
          <CardDescription>Select all that apply or add your own</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {COMMON_EMOTIONS.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => toggleEmotion(emotion)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedEmotions.includes(emotion)
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>

          {/* Custom emotion input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom emotion..."
              value={customEmotion}
              onChange={(e) => setCustomEmotion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomEmotion();
                }
              }}
            />
            <Button type="button" onClick={addCustomEmotion} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected emotions */}
          {selectedEmotions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground self-center">Selected:</span>
              {selectedEmotions.map((emotion) => (
                <span
                  key={emotion}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                >
                  {emotion}
                  <button
                    type="button"
                    onClick={() => toggleEmotion(emotion)}
                    className="hover:text-purple-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Intensity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How intense were these emotions?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setIntensity(value as 1 | 2 | 3 | 4 | 5)}
                className={`w-12 h-12 rounded-full font-bold transition-all ${
                  intensity === value
                    ? "bg-purple-600 text-white scale-110 shadow-lg"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">1 = Very Low, 5 = Very High</p>
        </CardContent>
      </Card>

      {/* Situation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What happened?</CardTitle>
          <CardDescription>Describe the situation or event</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
            placeholder="Example: Had a difficult conversation with my manager about my workload..."
            required
          />
        </CardContent>
      </Card>

      {/* Thoughts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What were you thinking?</CardTitle>
          <CardDescription>Your thoughts during or after the situation</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
            placeholder="Example: I felt like I wasn't being heard and that my concerns don't matter..."
          />
        </CardContent>
      </Card>

      {/* Body Sensations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What did you feel in your body?</CardTitle>
          <CardDescription>Physical sensations you noticed</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={bodySensations}
            onChange={(e) => setBodySensations(e.target.value)}
            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
            placeholder="Example: Tight chest, racing heart, tense shoulders, butterflies in stomach..."
          />
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background"
            placeholder="Any other observations or reflections..."
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          {entry ? "Update Entry" : "Save Entry"}
        </Button>
      </div>
    </form>
  );
}
