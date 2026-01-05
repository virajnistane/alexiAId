/**
 * Reusable page header component
 */

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">{title}</h1>
        {description ? <p className="text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
