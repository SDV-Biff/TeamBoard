import { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCreateTask: (status: TaskStatus) => void;
}

const columns: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'todo', title: 'To Do', color: 'border-t-muted-foreground' },
  { status: 'inProgress', title: 'In Progress', color: 'border-t-primary' },
  { status: 'cancelled', title: 'Cancelled', color: 'border-t-destructive' },
  { status: 'done', title: 'Done', color: 'border-t-success' },
];

const KanbanBoard = ({ tasks, onEditTask, onDeleteTask, onCreateTask }: KanbanBoardProps) => {
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);
        
        return (
          <Card key={column.status} className={cn('flex flex-col border-t-4', column.color)}>
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
            <CardContent className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
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
          </Card>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
