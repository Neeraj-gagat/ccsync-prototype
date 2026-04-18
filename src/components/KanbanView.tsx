// v2
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import type { Task } from '../types';
// import { modifyTaskOnBackend } from './hooks';
// import { db } from './Tasks';
// import { url } from '@/components/utils/URLs';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { toast } from 'react-toastify';
// import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';

interface KanbanViewProps {
  email?: string;
  encryptionSecret?: string;
  UUID?: string;
  onTaskClick: (task: Task) => void;
  tasks: Task[];
}

const PRIORITY_CONFIG: Record<string, { dot: string; label: string }> = {
  H: { dot: 'bg-red-500', label: 'High' },
  M: { dot: 'bg-yellow-400', label: 'Medium' },
  L: { dot: 'bg-green-500', label: 'Low' },
};

function PriorityDot({ priority }: { priority?: string }) {
  if (!priority) return null;
  const config = PRIORITY_CONFIG[priority];
  if (!config) return null;
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`}
      title={config.label}
    />
  );
}

function extractColorFromClass(accentClass?: string) {
  if (!accentClass) return 'rgba(255,255,255,0.1)';

  // Matches: border-l-[#34D4FD]
  const match = accentClass.match(/\[(#.*?)\]/);

  if (match) {
    return hexToRgba(match[1], 0.25);
  }

  // fallback for Tailwind colors like border-l-emerald-500
  return 'rgba(255,255,255,0.1)';
}

function hexToRgba(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function DependencyIndicator({ task }: { task: Task }) {
  const hasDependencies = task.depends && task.depends.length > 0;
  if (!hasDependencies) return null;

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded"
      title={`Depends on ${task.depends?.length} task(s)`}
    >
      <svg
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
      {task.depends?.length}
    </span>
  );
}

function TaskCard({
  task,
  onClick,
  accentClass,
//   accentClass2,
}: {
  task: Task;
  onClick: (task: Task) => void;
  accentClass?: string;
  accentClass2?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.uuid });

  const shadowColor = extractColorFromClass(accentClass);

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  //   opacity: isDragging ? 0.35 : 1,
  //   boxShadow: `0 10px 12px ${shadowColor}`,
  // };

  const isOverdue = Boolean(
    task.due &&
    task.due.trim() !== '' &&
    !isNaN(new Date(task.due).getTime()) &&
    new Date(task.due) < new Date() &&
    task.status === 'pending'
  );

  const isCompleted = task.status === 'completed';
  const dateLabel =
    task.due && task.due.trim() !== '' && !isNaN(new Date(task.due).getTime())
      ? new Date(task.due).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        })
      : isCompleted
        ? 'Completed'
        : '';

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        boxShadow: `0 0px 4px ${shadowColor}`,
        borderLeft: `3px solid  ${extractColorFromClass(accentClass)}`,
        // backgroundColor: isDragging ? '#091328' : '#091328',
        // borderColor: `${shadowColor}`
      }}
      // hover:shadow-[0_10px_12px_rgba(52,212,253,0.1)]
      className={`group bg-[#091328] border-l-2 border-white/[0.06] rounded-xl p-3.5 mb-2.5 hover:-translate-y-1 hover:bg-[#091328] transition-all duration-300 ${accentClass}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 6px 8px ${shadowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0px 4px ${shadowColor}`;
      }}
    >
      {/* Drag handle + title row */}
      <div className="flex items-start gap-2.5 mb-3">
        {/* Separate drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-0.5 text-white/15 hover:text-white/40 transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        </div>

        {/* Title - clickable separately */}
        <div className="flex-1 cursor-pointer" onClick={() => onClick(task)}>
          <p
            className={`text-[15px] font-semibold leading-snug ${
              isCompleted ? 'line-through text-white/30' : 'text-white/90'
            }`}
          >
            {task.description}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div
        onClick={() => onClick(task)}
        className="flex items-center gap-2 flex-wrap cursor-pointer"
      >
        {/* Priority dot + dependency + project tag */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <PriorityDot priority={task.priority} />
          <DependencyIndicator task={task} />
          {(task.project || task.tags?.[0]) && (
            <span className="text-[11px] font-medium bg-white/[0.07] text-white/50 px-2 py-0.5 rounded-md tracking-wide">
              {task.project || task.tags?.[0]}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Date with icon */}
        {dateLabel !== '' && (
          <span
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
              isCompleted
                ? 'text-green-400 bg-green-500/10'
                : isOverdue
                  ? 'text-red-400 bg-red-500/10'
                  : 'text-white/40 bg-white/[0.04]'
            }`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {dateLabel}
          </span>
        )}
      </div>
    </div>
  );
}

const COLUMN_ACCENTS = [
  'border-t-[#34D4FD]',
  'border-t-[#F673B7]',
  'border-t-[#9BFFCE]',
  'border-t-[#FFD700]',
  'border-t-[#FF69B4]',
  'border-t-[#00FFFF]',
  'border-t-[#FF00FF]',
  'border-t-[#FFA500]',
];

const COLUMN_ACCENTS2 = [
  'border-l-[#34D4FD]',
  'border-l-[#F673B7]',
  'border-l-[#9BFFCE]',
  'border-l-[#FFD700]',
  'border-l-[#FF69B4]',
  'border-l-[#00FFFF]',
  'border-l-[#FF00FF]',
  'border-l-[#FFA500]',
];

function KanbanColumn({
  column,
  tasks,
  onTaskClick,
  accentClass,
  onAddTask,
}: {
  column: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  accentClass: string;
  onAddTask?: (project: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column });
  const shadowColor = extractColorFromClass(accentClass);

  return (
    <div
      style={{
        borderColor: `${shadowColor}`,
      }}
      className={`flex flex-col min-w-[230px] max-w-[300px] h-[460px] rounded-2xl border-white/[0.07] border  transition-colors duration-200 bg-gradient-to-r from-[#060E20] to-[#060e23]
shadow-inner ${accentClass} ${isOver ? 'bg-white/[0.04]' : 'bg-[#060E20]'}`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.05]">
        <div>
          <div className="flex justify-start items-center">
            <div
              style={{
                background: ` ${shadowColor}`,
              }}
              className={`h-6 w-2 rounded-md mr-4`}
            ></div>
            <h3 className="font-semibold text-sm text-white/75 tracking-wide uppercase truncate">
              {column}
            </h3>
          </div>

          <p className="text-[10px] text-white/25 mt-0.5">
            Drag to reorder • Click to edit
          </p>
        </div>
        <span className="text-[11px] font-semibold bg-white/[0.08] text-white/40 rounded-full px-2.5 py-1 ml-2 flex-shrink-0">
          {tasks.length}
        </span>
      </div>

      {/* Scrollable task list */}
      <SortableContext
        items={tasks.map((t) => t.uuid)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="flex-1 overflow-y-auto px-3 py-3 min-h-[120px] max-h-[520px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <svg
                className="w-8 h-8 text-white/10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-xs text-white/20 text-center select-none">
                No tasks yet
              </p>
            </div>
          ) : (
            tasks.map((task, idx) => (
              <TaskCard
                accentClass={accentClass}
                accentClass2={COLUMN_ACCENTS2[idx % COLUMN_ACCENTS2.length]}
                key={task.uuid}
                task={task}
                onClick={onTaskClick}
              />
            ))
          )}
        </div>
      </SortableContext>

      {/* Footer add button */}
      <button
        onClick={() => onAddTask?.(column)}
        className="flex items-center justify-center gap-1.5 w-full px-4 py-3 text-xs font-medium text-white/30 hover:text-white/60 hover:bg-white/[0.02] transition-all duration-150 border-t border-white/[0.05] rounded-b-2xl"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add task
      </button>
    </div>
  );
}

export function KanbanView({
//   email,
//   encryptionSecret,
//   UUID,
  onTaskClick,
  tasks,
}: KanbanViewProps) {
  const projects = Array.from(
    new Set(tasks.map((t) => t.project || 'No Project'))
  ).sort();

//   const [tasksByProject, setTasksByProject] = useState<Record<string, Task[]>>(
//     {}
//   );
  const [activeTask, setActiveTask] = useState<Task | null>(null);

 const [tasksByProject, setTasksByProject] = useState(() => {
  const grouped: Record<string, Task[]> = {}

  projects.forEach((p) => {
    grouped[p] = tasks.filter(
      (t) => (t.project || 'No Project') === p && t.status !== 'deleted'
    )
  })

  return grouped
})

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskUUID = active.id as string;
    const newProject = over.id as string;
    const allTasks = Object.values(tasksByProject).flat();
    const task = allTasks.find((t) => t.uuid === taskUUID);
    if (!task) return;

    const currentProject = task.project || 'No Project';
    if (currentProject === newProject) return;

    setTasksByProject((prev) => {
      const updated = { ...prev };
      updated[currentProject] = updated[currentProject].filter(
        (t) => t.uuid !== taskUUID
      );
      const projectValue = newProject === 'No Project' ? '' : newProject;
      updated[newProject] = [
        ...(updated[newProject] || []),
        { ...task, project: projectValue },
      ];
      return updated;
    });

    // try {
    //   await modifyTaskOnBackend({
    //     email,
    //     encryptionSecret,
    //     UUID,
    //     taskUUID,
    //     description: task.description,
    //     project: newProject === 'No Project' ? '' : newProject,
    //     priority: task.priority || '',
    //     status: task.status,
    //     due: task.due || '',
    //     tags: task.tags || [],
    //     backendURL: url.backendURL,
    //   });

    //   await db.tasks
    //     .where('uuid')
    //     .equals(taskUUID)
    //     .modify({
    //       project: newProject === 'No Project' ? '' : newProject,
    //     });

    //   toast.success(`Task moved to ${newProject}`);
    // } catch (error) {
    //   toast.error('Failed to move task');
    //   setTasksByProject((prev) => {
    //     const updated = { ...prev };
    //     updated[newProject] = updated[newProject].filter(
    //       (t) => t.uuid !== taskUUID
    //     );
    //     updated[currentProject] = [...updated[currentProject], task];
    //     return updated;
    //   });
    // }
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
            />
          </svg>
        </div>
        <p className="text-sm text-white/30">
          No projects yet. Assign a project to a task to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pt-20 px-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className='pl-10'>
          <div className="relative inline-block">
            {/* Glow background */}
            <div className="absolute inset-0 blur-xl bg-[#34D4FD]/20 rounded-full"></div>

            {/* Text */}
            <h2 className="relative text-4xl font-semibold tracking-tight bg-gradient-to-r from-[#34D4FD] via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Kanban Project Board
            </h2>
          </div>
          <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
            Organize tasks by project • {" "} <span className='font-bold bg-gradient-to-r from-[#34D4FD] via-cyan-300 to-blue-400 bg-clip-text text-transparent'> Drag to move </span> between columns
          </p>
        </div>
        <div className="flex gap-2 pr-10">
          <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/50 hover:bg-white/[0.10] hover:text-white/70 transition-all border border-white/[0.07]">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </span>
          </button>
          <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#34D4FD] text-[#060E20] hover:bg-white/[0.10] hover:text-white/70 transition-all border border-white/[0.07]">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              Sort
            </span>
          </button>
        </div>
      </div>

      {/* Board */}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => {
          const allTasks = Object.values(tasksByProject).flat();
          const task = allTasks.find((t) => t.uuid === event.active.id);
          setActiveTask(task || null);
        }}
      >
        <div className="gap-3 overflow-x-auto pb-6 grid grid-cols-4 px-20">
          {projects.map((project, idx) => (
            <KanbanColumn
              key={project}
              column={project}
              tasks={tasksByProject[project] || []}
              onTaskClick={onTaskClick}
              accentClass={COLUMN_ACCENTS[idx % COLUMN_ACCENTS.length]}
              onAddTask={(proj) => {
                toast.info(`Add task to ${proj}`);
              }}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="bg-[#091328] border border-[#34D4FD]/30 rounded-xl p-3.5 shadow-2xl w-62 opacity-90 scale-105">
              <p className="text-sm font-medium text-white/85">
                {activeTask.description}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
