/**
 * Balance Card Component
 *
 * Displays the available ToughTongue AI minutes balance with a refresh button.
 * Shows loading and error states appropriately.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Balance } from "@/lib/ttai";
import { Wallet, RefreshCw, Loader2 } from "lucide-react";

interface BalanceCardProps {
  /** Current balance data, or null if not loaded */
  balance: Balance | null;
  /** Whether balance is currently being fetched */
  isLoading: boolean;
  /** Callback to refresh the balance */
  onRefresh: () => void;
}

export function BalanceCard({ balance, isLoading, onRefresh }: BalanceCardProps) {
  return (
    <Card className="mb-6 bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-lg">Available Minutes</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        ) : balance ? (
          <div className="text-3xl font-bold text-foreground">
            {balance.available_minutes.toFixed(1)}{" "}
            <span className="text-lg font-normal text-muted-foreground">minutes</span>
          </div>
        ) : (
          <p className="text-muted-foreground">Unable to load balance</p>
        )}
      </CardContent>
    </Card>
  );
}
