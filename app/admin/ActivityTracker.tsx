"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Filter, X } from "lucide-react";
import { useAppStore, type ActivityLog } from "@/lib/store";

const ACTION_LABELS: Record<ActivityLog["action"], string> = {
  sign_in: "Sign In",
  sign_out: "Sign Out",
  start_assessment: "Start Assessment",
  complete_assessment: "Complete Assessment",
  start_coaching: "Start Coaching",
  complete_coaching: "Complete Coaching",
  create_journal: "Create Journal Entry",
  update_journal: "Update Journal Entry",
  delete_journal: "Delete Journal Entry",
  export_data: "Export Data",
  import_data: "Import Data",
  clear_data: "Clear Data",
};

const ACTION_COLORS: Record<ActivityLog["action"], string> = {
  sign_in: "bg-green-500/20 text-green-400",
  sign_out: "bg-gray-500/20 text-gray-400",
  start_assessment: "bg-blue-500/20 text-blue-400",
  complete_assessment: "bg-blue-500/20 text-blue-400",
  start_coaching: "bg-purple-500/20 text-purple-400",
  complete_coaching: "bg-purple-500/20 text-purple-400",
  create_journal: "bg-pink-500/20 text-pink-400",
  update_journal: "bg-pink-500/20 text-pink-400",
  delete_journal: "bg-red-500/20 text-red-400",
  export_data: "bg-cyan-500/20 text-cyan-400",
  import_data: "bg-cyan-500/20 text-cyan-400",
  clear_data: "bg-red-500/20 text-red-400",
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function ActivityTracker() {
  const { getActivityLogs, clearActivityLogs } = useAppStore();
  const [userFilter, setUserFilter] = useState("");
  const [actionFilter, setActionFilter] = useState<ActivityLog["action"] | "">("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const filteredLogs = useMemo(() => {
    const filters: Parameters<typeof getActivityLogs>[0] = {};
    
    if (actionFilter) filters.action = actionFilter;
    if (dateRange.start && dateRange.end) {
      filters.startDate = dateRange.start;
      filters.endDate = dateRange.end;
    }

    let logs = getActivityLogs(filters);

    // Client-side user name filter (fuzzy search)
    if (userFilter) {
      const search = userFilter.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.userName.toLowerCase().includes(search) ||
          log.userEmail?.toLowerCase().includes(search)
      );
    }

    return logs;
  }, [getActivityLogs, userFilter, actionFilter, dateRange]);

  const handleExport = () => {
    const csv = [
      ["Timestamp", "User", "Email", "Action", "Details"].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          `"${log.userName}"`,
          `"${log.userEmail || ""}"`,
          ACTION_LABELS[log.action],
          `"${log.details || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasFilters = userFilter || actionFilter || dateRange.start || dateRange.end;

  const clearFilters = () => {
    setUserFilter("");
    setActionFilter("");
    setDateRange({ start: "", end: "" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>
              Track user actions and interactions ({filteredLogs.length} events)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={filteredLogs.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Filter by user name or email..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as ActivityLog["action"] | "")}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option value="">All Actions</option>
            {Object.entries(ACTION_LABELS).map(([action, label]) => (
              <option key={action} value={action}>
                {label}
              </option>
            ))}
          </select>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-[150px]"
          />
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-[150px]"
          />
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Activity Table */}
        <div className="border rounded-md">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No activity logs found</p>
              {hasFilters && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Time</th>
                    <th className="text-left p-3 text-sm font-medium">User</th>
                    <th className="text-left p-3 text-sm font-medium">Action</th>
                    <th className="text-left p-3 text-sm font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/30">
                      <td className="p-3 text-sm text-muted-foreground whitespace-nowrap">
                        <div>{formatTimestamp(log.timestamp)}</div>
                        <div className="text-xs opacity-70">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <div className="font-medium">{log.userName}</div>
                        {log.userEmail && (
                          <div className="text-xs text-muted-foreground">{log.userEmail}</div>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            ACTION_COLORS[log.action]
                          }`}
                        >
                          {ACTION_LABELS[log.action]}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {log.details || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Clear All Button */}
        {filteredLogs.length > 0 && (
          <div className="flex justify-end pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Clear all activity logs? This cannot be undone.")) {
                  clearActivityLogs();
                }
              }}
              className="text-red-400 hover:text-red-300"
            >
              Clear All Logs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
