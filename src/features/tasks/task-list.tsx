"use client";

import { useState } from "react";
import type { Task, FamilySide, TaskStatus } from "@/lib/types/wedding";
import { SideBadge } from "@/components/ui/side-badge";
import { usePerspective } from "@/hooks";
import { generateWhatsAppLink, buildTaskNudgeMessage, cn } from "@/lib/utils";
import { PRIORITY_CONFIG, EVENT_META } from "@/lib/constants/events";
import { format } from "date-fns";
import {
  Circle, CheckCircle2, Clock, AlertCircle,
  MessageCircle, Filter, CalendarDays, Trash2, Pencil,
} from "lucide-react";

const STATUS_CYCLE: TaskStatus[] = ["pending", "in_progress", "done"];

const STATUS_ICONS = {
  pending: Circle,
  in_progress: Clock,
  done: CheckCircle2,
  cancelled: AlertCircle,
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
  cancelled: "Cancelled",
};

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, patch: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask?: (task: Task) => void;
}

export function TaskList({ tasks, onUpdateTask, onDeleteTask, onEditTask }: TaskListProps) {
  const { isVisible } = usePerspective();
  const [filterSide, setFilterSide] = useState<FamilySide | "all">("all");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");

  const filtered = tasks
    .filter((t) => (filterSide === "all" || t.side === filterSide) && isVisible(t.side))
    .filter((t) => filterStatus === "all" || t.status === filterStatus);

  const grouped = {
    urgent: filtered.filter((t) => t.priority === "urgent" && t.status !== "done"),
    active: filtered.filter((t) => t.priority !== "urgent" && t.status !== "done" && t.status !== "cancelled"),
    completed: filtered.filter((t) => t.status === "done" || t.status === "cancelled"),
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Filter size={14} className="text-muted-foreground" />
        <select value={filterSide} onChange={(e) => setFilterSide(e.target.value as FamilySide | "all")}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
          <option value="all">All Sides</option>
          <option value="bride">Bride&apos;s Side</option>
          <option value="groom">Groom&apos;s Side</option>
          <option value="shared">Shared</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "all")}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
          <option value="all">All Status</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {grouped.urgent.length > 0 && (
        <TaskSection title="Urgent" tasks={grouped.urgent} onUpdate={onUpdateTask} onDelete={onDeleteTask} onEdit={onEditTask} />
      )}
      <TaskSection title="Active" tasks={grouped.active} onUpdate={onUpdateTask} onDelete={onDeleteTask} onEdit={onEditTask} />
      {grouped.completed.length > 0 && (
        <TaskSection title="Completed" tasks={grouped.completed} onUpdate={onUpdateTask} onDelete={onDeleteTask} onEdit={onEditTask} defaultCollapsed />
      )}
    </div>
  );
}

function TaskSection({ title, tasks, onUpdate, onDelete, onEdit, defaultCollapsed = false }: {
  title: string; tasks: Task[]; defaultCollapsed?: boolean;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  return (
    <div className="space-y-2">
      <button onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
        <span>{title} ({tasks.length})</span>
        <span>{collapsed ? "+" : "−"}</span>
      </button>
      {!collapsed && (
        <div className="space-y-2">
          {tasks.map((task) => <TaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} onEdit={onEdit} />)}
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onUpdate, onDelete, onEdit }: {
  task: Task;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}) {
  const StatusIcon = STATUS_ICONS[task.status];
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const eventMeta = EVENT_META[task.event];

  const cycleStatus = () => {
    const idx = STATUS_CYCLE.indexOf(task.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    onUpdate(task.id, { status: next });
  };

  const handleNudge = () => {
    if (!task.assigneePhone) return;
    const dueStr = task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : undefined;
    const message = buildTaskNudgeMessage(task.title, dueStr);
    window.open(generateWhatsAppLink(message, task.assigneePhone), "_blank");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm">
      <div className="flex items-start gap-3">
        <button onClick={cycleStatus} className="mt-0.5 shrink-0" title="Cycle status">
          <StatusIcon size={20} className={cn(
            task.status === "done" && "text-accent-emerald",
            task.status === "pending" && "text-muted-foreground",
            task.status === "in_progress" && "text-accent-gold",
            task.status === "cancelled" && "text-red-400"
          )} />
        </button>
        <div className="flex-1 min-w-0">
          <h4 className={cn("text-sm font-medium", task.status === "done" && "line-through text-muted-foreground")}>
            {task.title}
          </h4>
          {task.description && <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs">{eventMeta.emoji} {eventMeta.label}</span>
            <SideBadge side={task.side} />
            <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: priorityConfig.color }}>{priorityConfig.label}</span>
            {task.dueDate && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <CalendarDays size={10} />{format(new Date(task.dueDate), "MMM d")}
              </span>
            )}
          </div>
          {task.assignee && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">→ {task.assignee}</span>
              {task.assigneePhone && (
                <button onClick={handleNudge}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 hover:bg-emerald-200 transition-colors">
                  <MessageCircle size={10} />Nudge
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          {onEdit && (
            <button onClick={() => onEdit(task)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-blue-50 hover:text-blue-500 transition-colors"
              title="Edit task">
              <Pencil size={14} />
            </button>
          )}
          <button onClick={() => onDelete(task.id)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Delete task">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
