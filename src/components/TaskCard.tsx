import { Task, TaskType } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, User, GripVertical } from 'lucide-react';
import { mockUsers } from '@/data/mockUsers';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const taskTypeConfig: Record<TaskType, { label: string; className: string }> = {
  bug: { label: 'Bug', className: 'bg-destructive text-destructive-foreground' },
  feature: { label: 'Feature', className: 'bg-primary text-primary-foreground' },
  improvement: { label: 'Improvement', className: 'bg-success text-success-foreground' },
};

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const assignee = mockUsers.find((u) => u.id === task.assigneeId);
  const typeConfig = taskTypeConfig[task.type];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'p-4 hover:shadow-md transition-all cursor-move group',
        isDragging && 'shadow-xl ring-2 ring-primary/30'
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div
              {...attributes}
              {...listeners}
              className="mt-1 text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
              {task.title}
            </h3>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(task)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <Badge className={cn('text-xs', typeConfig.className)}>
            {typeConfig.label}
          </Badge>
          
          {assignee && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{assignee.name}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
