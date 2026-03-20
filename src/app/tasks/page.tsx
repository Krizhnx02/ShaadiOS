"use client";

import { useState } from "react";
import { useWeddingData } from "@/hooks/useWeddingData";
import { TaskList } from "@/features/tasks/task-list";
import { TaskModal } from "@/features/tasks/task-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressRing } from "@/components/ui/progress-ring";
import { CheckSquare, Plus } from "lucide-react";
import type { Task } from "@/lib/types/wedding";

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useWeddingData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const openAdd = () => { setEditingTask(null); setIsModalOpen(true); };
  const openEdit = (task: Task) => { setEditingTask(task); setIsModalOpen(true); };
  const closeModal = () => { setEditingTask(null); setIsModalOpen(false); };

  if (tasks.length === 0) {
    return (
      <>
        <EmptyState
          icon={<CheckSquare size={28} />}
          title="No tasks yet"
          description="Create your first wedding task. Assign to family members and send WhatsApp reminders."
          action={
            <button onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-emerald px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-emerald/90 transition-colors">
              <Plus size={16} />Add Task
            </button>
          }
        />
        <TaskModal isOpen={isModalOpen} onClose={closeModal} onAdd={addTask}
          editingTask={editingTask} onUpdate={updateTask} />
      </>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ProgressRing progress={progress} size={56} strokeWidth={5}
            color="var(--accent-emerald)" label={`${completedCount}`} />
          <div>
            <h1 className="text-xl font-bold">Tasks</h1>
            <p className="text-sm text-muted-foreground">{completedCount} of {totalCount} completed</p>
          </div>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-accent-emerald px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-emerald/90 transition-colors">
          <Plus size={16} />Add Task
        </button>
      </div>
      <TaskList tasks={tasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} onEditTask={openEdit} />
      <TaskModal isOpen={isModalOpen} onClose={closeModal} onAdd={addTask}
        editingTask={editingTask} onUpdate={updateTask} />
    </div>
  );
}
