/**
 * Statistics cards component for displaying sustainability metrics.
 *
 * This component renders key statistics about sustainability actions
 * in an attractive glassmorphism card layout with animations.
 */
"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Calendar, Award, Target } from "lucide-react";
import type { SustainabilityAction } from "@/lib/api";

interface StatsCardsProps {
  actions: SustainabilityAction[];
  isLoading: boolean;
}

/**
 * Calculate statistics from the actions array.
 * Provides various metrics for display in the stats cards.
 */
function calculateStats(actions: SustainabilityAction[]) {
  const totalActions = actions.length;
  const totalPoints = actions.reduce((sum, action) => sum + action.points, 0);

  // Calculate this month's actions
  const now = new Date();
  const thisMonthActions = actions.filter((action) => {
    const actionDate = new Date(action.date);
    return (
      actionDate.getMonth() === now.getMonth() &&
      actionDate.getFullYear() === now.getFullYear()
    );
  });

  // Calculate this week's actions
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekActions = actions.filter((action) => {
    const actionDate = new Date(action.date);
    return actionDate >= oneWeekAgo;
  });

  // Calculate average points per action
  const averagePoints =
    totalActions > 0 ? Math.round(totalPoints / totalActions) : 0;

  return {
    totalActions,
    totalPoints,
    thisMonthActions: thisMonthActions.length,
    thisWeekActions: thisWeekActions.length,
    averagePoints,
    thisMonthPoints: thisMonthActions.reduce(
      (sum, action) => sum + action.points,
      0
    ),
  };
}

/**
 * Loading skeleton for stats cards.
 * Displays placeholder content while data is being fetched.
 */
function StatsCardSkeleton() {
  return (
    <Card className="backdrop-blur-md bg-card/60 border border-border/20 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

/**
 * Individual stat card component with glassmorphism styling.
 */
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  style?: React.CSSProperties;
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend = "neutral",
  className = "",
  style,
}: StatCardProps) {
  const trendColors = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
  };

  return (
    <Card
      className={`backdrop-blur-md bg-card/60 border border-border/20 shadow-lg hover:bg-card/80 hover:shadow-xl transition-all duration-300 ${className}`}
      style={style}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <p className={`text-xs font-medium ${trendColors[trend]}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Main stats cards component.
 * Displays key sustainability metrics in a responsive grid layout.
 */
export function StatsCards({ actions, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatsCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const stats = calculateStats(actions);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Actions Card */}
      <StatCard
        title="Total Actions"
        value={stats.totalActions}
        description={`${stats.thisWeekActions} this week`}
        icon={<Calendar className="h-4 w-4 text-primary" />}
        trend={stats.thisWeekActions > 0 ? "up" : "neutral"}
        className="animate-slide-in-up"
      />

      {/* Total Points Card */}
      <StatCard
        title="Total Points"
        value={stats.totalPoints.toLocaleString()}
        description={`${stats.thisMonthPoints} this month`}
        icon={<Award className="h-4 w-4 text-secondary" />}
        trend={stats.thisMonthPoints > 0 ? "up" : "neutral"}
        className="animate-slide-in-up"
        style={{ animationDelay: "0.1s" }}
      />

      {/* Average Points Card */}
      <StatCard
        title="Average Points"
        value={stats.averagePoints}
        description="per action"
        icon={<TrendingUp className="h-4 w-4 text-accent" />}
        trend="neutral"
        className="animate-slide-in-up"
        style={{ animationDelay: "0.2s" }}
      />

      {/* Monthly Goal Card */}
      <StatCard
        title="Monthly Progress"
        value={`${Math.min(
          100,
          Math.round((stats.thisMonthActions / 20) * 100)
        )}%`}
        description={`${stats.thisMonthActions}/20 goal`}
        icon={<Target className="h-4 w-4 text-primary" />}
        trend={
          stats.thisMonthActions >= 20
            ? "up"
            : stats.thisMonthActions > 10
            ? "neutral"
            : "down"
        }
        className="animate-slide-in-up"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  );
}
