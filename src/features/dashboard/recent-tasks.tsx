"use client";

import Link from "next/link";
import type { Task } from "@/lib/types/wedding";
import { SideBadge } from "@/components/ui/side-badge";
import { PRIORITY_CONFIG } from "@/lib/constants/events";
import { cn } from "@/lib/utils";
import { Circle, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";

const STATUS_ICONS = {
  pending: Circle,
  in_progress: Clock,
  done: CheckCircle2,
  cancelled: AlertCircle,
};

interface RecentTasksProps {
  tasks: Task[];
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Tasks</h3>
        {tasks.length > 0 && (
          <Link href="/tasks" className="flex items-center gap-1 text-xs text-accent-emerald hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        )}
      </div>
      {recentTasks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No tasks yet</p>
          <Link href="/tasks" className="mt-2 inline-block text-xs font-medium text-accent-emerald hover:underline">
            Add your first task →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {recentTasks.map((task) => {
            const StatusIcon = STATUS_ICONS[task.status];
            const priorityColor = PRIORITY_CONFIG[task.priority].color;
            return (
              <div key={task.id} className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted">
                <StatusIcon size={18} className={cn(
                  task.status === "done" && "text-accent-emerald",
                  task.status === "pending" && "text-muted-foreground",
                  task.status === "in_progress" && "text-accent-gold",
                  task.status === "cancelled" && "text-red-400"
                )} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium truncate",
                    task.status === "done" && "line-through text-muted-foreground")}>
                    {task.title}
                  </p>
                  {task.assignee && <p className="text-xs text-muted-foreground truncate">{task.assignee}</p>}
                </div>
                <SideBadge side={task.side} />
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: priorityColor }}
                  title={PRIORITY_CONFIG[task.priority].label} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
