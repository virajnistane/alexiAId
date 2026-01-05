/**
 * Reusable empty state component for when there's no data
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <Card className="max-w-lg mx-auto bg-card border-border">
      <CardHeader className="text-center">
        <Icon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children ? <CardContent className="text-center">{children}</CardContent> : null}
    </Card>
  );
}
