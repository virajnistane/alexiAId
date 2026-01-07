"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, FileText, TrendingUp, Clock, Calendar } from "lucide-react";
import { useAppStore } from "@/lib/store";

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color = "text-purple-400",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-3">
        <div className={`${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}

export function UserStatsCard() {
  const { activityLogs, journalEntries, sessionDetails, assessmentSessions, coachSessions } =
    useAppStore();

  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Unique users
    const allUsers = new Set<string>();
    activityLogs.forEach((log) => allUsers.add(log.userId));
    journalEntries.forEach((entry) => allUsers.add(entry.userId));

    // Active users (last 7/30 days)
    const activeUsers7d = new Set<string>();
    const activeUsers30d = new Set<string>();
    activityLogs.forEach((log) => {
      const logDate = new Date(log.timestamp);
      if (logDate >= sevenDaysAgo) activeUsers7d.add(log.userId);
      if (logDate >= thirtyDaysAgo) activeUsers30d.add(log.userId);
    });

    // Session stats
    const totalSessions = assessmentSessions.length + coachSessions.length;
    const completedSessions = Object.values(sessionDetails).filter(
      (s) => s.status === "completed"
    ).length;

    // Average session duration
    const sessionsWithDuration = Object.values(sessionDetails).filter((s) => s.duration);
    const avgDuration =
      sessionsWithDuration.length > 0
        ? sessionsWithDuration.reduce((sum, s) => sum + (s.duration || 0), 0) /
          sessionsWithDuration.length
        : 0;

    // Journal stats
    const totalJournalEntries = journalEntries.length;
    const journalEntries7d = journalEntries.filter(
      (entry) => new Date(entry.createdAt) >= sevenDaysAgo
    ).length;

    // Recent activity
    const activities7d = activityLogs.filter(
      (log) => new Date(log.timestamp) >= sevenDaysAgo
    ).length;

    // Sign-ins
    const signIns7d = activityLogs.filter(
      (log) => log.action === "sign_in" && new Date(log.timestamp) >= sevenDaysAgo
    ).length;

    return {
      totalUsers: allUsers.size,
      activeUsers7d: activeUsers7d.size,
      activeUsers30d: activeUsers30d.size,
      totalSessions,
      completedSessions,
      avgDuration: Math.round(avgDuration),
      totalJournalEntries,
      journalEntries7d,
      activities7d,
      signIns7d,
    };
  }, [activityLogs, journalEntries, sessionDetails, assessmentSessions, coachSessions]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
        <CardDescription>Overview of user activity and engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            color="text-blue-400"
          />
          <StatCard
            icon={Activity}
            label="Active Users (7d)"
            value={stats.activeUsers7d}
            subtext={`${stats.activeUsers30d} in last 30 days`}
            color="text-green-400"
          />
          <StatCard
            icon={TrendingUp}
            label="Sign-ins (7d)"
            value={stats.signIns7d}
            subtext={`${stats.activities7d} total activities`}
            color="text-purple-400"
          />
          <StatCard
            icon={Calendar}
            label="Total Sessions"
            value={stats.totalSessions}
            subtext={`${stats.completedSessions} completed`}
            color="text-orange-400"
          />
          <StatCard
            icon={Clock}
            label="Avg Session Duration"
            value={stats.avgDuration > 0 ? formatDuration(stats.avgDuration) : "N/A"}
            color="text-cyan-400"
          />
          <StatCard
            icon={FileText}
            label="Journal Entries"
            value={stats.totalJournalEntries}
            subtext={`${stats.journalEntries7d} in last 7 days`}
            color="text-pink-400"
          />
        </div>

        {/* Engagement Rate */}
        <div className="mt-6 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Weekly Engagement Rate</p>
              <p className="text-lg font-semibold">
                {stats.totalUsers > 0
                  ? `${Math.round((stats.activeUsers7d / stats.totalUsers) * 100)}%`
                  : "N/A"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Monthly Retention</p>
              <p className="text-lg font-semibold">
                {stats.totalUsers > 0
                  ? `${Math.round((stats.activeUsers30d / stats.totalUsers) * 100)}%`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
