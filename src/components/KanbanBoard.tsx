import { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import { useState } from 'react';

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCreateTask: (status: TaskStatus) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const columns: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'todo', title: 'To Do', color: 'border-t-muted-foreground' },
  { status: 'inProgress', title: 'In Progress', color: 'border-t-primary' },
  { status: 'cancelled', title: 'Cancelled', color: 'border-t-destructive' },
  { status: 'done', title: 'Done', color: 'border-t-success' },
];

const KanbanBoard = ({ tasks, onEditTask, onDeleteTask, onCreateTask, onUpdateTaskStatus }: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      onUpdateTaskStatus(taskId, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          
          return (
            <Card key={column.status} className={cn('flex flex-col border-t-4 min-h-[400px]', column.color)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {column.title}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({columnTasks.length})
                    </span>
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => onCreateTask(column.status)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <DropZone status={column.status}>
                <CardContent className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[350px]">
                  {columnTasks.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      No tasks yet
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                      />
                    ))
                  )}
                </CardContent>
              </DropZone>
            </Card>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-50">
            <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// Drop zone component for columns
const DropZone = ({ status, children }: { status: TaskStatus; children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-colors rounded-lg',
        isOver && 'bg-primary/5 ring-2 ring-primary/20'
      )}
    >
      {children}
    </div>
  );
};

export default KanbanBoard;
