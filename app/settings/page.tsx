"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, Trash2, Shield, Database, AlertTriangle } from "lucide-react";
import { useAuth } from "@/app/auth/AuthContext";
import { useAppStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const { exportData, importData, clearUserData, clearAll } = useAppStore();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId =
    currentUser?.type === "local" ? currentUser.user.id : currentUser?.user.uid || "";

  const handleExportData = () => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `emotion-translator-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importData(content);
        
        if (success) {
          setImportStatus({
            type: "success",
            message: "Data imported successfully! Your data has been restored.",
          });
        } else {
          setImportStatus({
            type: "error",
            message: "Failed to import data. Please check that the file format is correct.",
          });
        }
      } catch (error) {
        setImportStatus({
          type: "error",
          message: "Failed to read file. Please ensure it's a valid JSON file.",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClearUserData = () => {
    clearUserData(userId);
    setShowClearDialog(false);
  };

  const handleClearAllData = () => {
    clearAll();
    setShowClearAllDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Data & Privacy"
        description="Manage your personal data and privacy settings"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Privacy Notice */}
        <Card className="border-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <CardTitle>Your Privacy Matters</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              All your data is stored <strong>locally in your browser</strong> using localStorage.
              Nothing is sent to external servers unless you explicitly use authentication features.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Journal entries, assessments, and preferences stay on your device</li>
              <li>You have complete control over your data</li>
              <li>Export your data anytime for backup or transfer</li>
              <li>Clearing browser data will remove all stored information</li>
            </ul>
          </CardContent>
        </Card>

        {/* Export Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-400" />
              <CardTitle>Export Your Data</CardTitle>
            </div>
            <CardDescription>
              Download all your data as a JSON file for backup or transfer to another device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportData}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Data
            </Button>
          </CardContent>
        </Card>

        {/* Import Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-400" />
              <CardTitle>Import Data</CardTitle>
            </div>
            <CardDescription>
              Restore your data from a previously exported file. This will merge with existing data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
              id="import-file"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File to Import
            </Button>

            {importStatus && (
              <div
                className={`p-3 rounded-md text-sm ${
                  importStatus.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {importStatus.message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clear My Data */}
        <Card className="border-orange-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-400" />
              <CardTitle>Clear My Data</CardTitle>
            </div>
            <CardDescription>
              Remove all your journal entries and personal data. Assessment and coaching sessions will be preserved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowClearDialog(true)}
              variant="outline"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear My Data
            </Button>
          </CardContent>
        </Card>

        {/* Clear All Data */}
        <Card className="border-red-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <CardTitle>Clear All Data</CardTitle>
            </div>
            <CardDescription>
              Permanently delete everything including all journal entries, assessments, and sessions. This cannot be undone!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowClearAllDialog(true)}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Everything
            </Button>
          </CardContent>
        </Card>

        {/* Data Storage Info */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">How Your Data is Stored</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Local Storage:</strong> All data is stored in your browser's localStorage under
              the key "ttai-app-store".
            </p>
            <p>
              <strong>Backup Recommendation:</strong> Regularly export your data to keep a backup,
              especially before clearing browser data or switching devices.
            </p>
            <p>
              <strong>Incognito/Private Mode:</strong> Data will be cleared when you close the browser window.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clear My Data Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Your Data?</DialogTitle>
            <DialogDescription>
              This will delete all your journal entries and personal data. Your assessment and
              coaching sessions will be preserved. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearUserData}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Clear My Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Data Dialog */}
      <Dialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Everything?</DialogTitle>
            <DialogDescription className="space-y-2">
              <p className="text-red-400 font-semibold">⚠️ WARNING: This is permanent!</p>
              <p>
                This will delete ALL data including journal entries, assessments, coaching sessions,
                and user information. Make sure you've exported your data if you want to keep it.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearAllDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAllData}>
              Yes, Delete Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
