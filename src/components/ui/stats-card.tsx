import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'info';
  trend?: 'up' | 'down';
  trendValue?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'default',
  trend,
  trendValue,
}: StatsCardProps) {
  const variantClasses = {
    default: 'border-border',
    success: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    info: 'border-info/20 bg-info/5',
  };

  const iconClasses = {
    default: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
  };

  return (
    <Card className={cn('transition-all hover:shadow-md', variantClasses[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', iconClasses[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && trendValue && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                'text-xs font-medium',
                trend === 'up' ? 'text-success' : 'text-destructive'
              )}
            >
              {trend === 'up' ? '↗' : '↘'} {trendValue}
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}