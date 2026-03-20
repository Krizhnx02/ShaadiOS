"use client";

import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { formatINRCompact } from "@/lib/utils";
import { usePerspective } from "@/hooks";
import type { DashboardStats } from "@/lib/types/wedding";
import {
  Wallet,
  CheckSquare,
  Users,
  Store,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const { isBlurred } = usePerspective();
  const budgetProgress = stats.totalBudget > 0 ? (stats.spentBudget / stats.totalBudget) * 100 : 0;
  const taskProgress = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 justify-center md:justify-start">
        <ProgressRing
          progress={budgetProgress}
          size={100}
          color="var(--accent-gold)"
          label={`${Math.round(budgetProgress)}%`}
          sublabel="Budget"
        />
        <ProgressRing
          progress={taskProgress}
          size={100}
          color="var(--accent-emerald)"
          label={`${Math.round(taskProgress)}%`}
          sublabel="Tasks"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          title="Total Budget"
          value={formatINRCompact(stats.totalBudget)}
          subtitle={`Spent: ${formatINRCompact(stats.spentBudget)}`}
          icon={<Wallet size={18} className="text-accent-gold" />}
        />
        <StatCard
          title="Bride's Side"
          value={formatINRCompact(stats.brideSideBudget)}
          icon={<TrendingDown size={18} className="text-bride-pink" />}
          blurred={isBlurred("bride")}
        />
        <StatCard
          title="Groom's Side"
          value={formatINRCompact(stats.groomSideBudget)}
          icon={<TrendingDown size={18} className="text-groom-blue" />}
          blurred={isBlurred("groom")}
        />
        <StatCard
          title="Shared"
          value={formatINRCompact(stats.sharedBudget)}
          icon={<TrendingDown size={18} className="text-shared-green" />}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          title="Tasks"
          value={`${stats.completedTasks}/${stats.totalTasks}`}
          subtitle={`${stats.pendingTasks} pending`}
          icon={<CheckSquare size={18} className="text-accent-emerald" />}
        />
        <StatCard
          title="Overdue"
          value={stats.overdueTasks}
          icon={<AlertTriangle size={18} className="text-red-500" />}
        />
        <StatCard
          title="Guests"
          value={`${stats.confirmedGuests}/${stats.totalGuests}`}
          subtitle="Confirmed"
          icon={<Users size={18} className="text-violet-500" />}
        />
        <StatCard
          title="Vendors"
          value={`${stats.bookedVendors}/${stats.totalVendors}`}
          subtitle="Booked"
          icon={<Store size={18} className="text-amber-600" />}
        />
      </div>
    </div>
  );
}
