import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskType } from '@/types';
import { storage } from '@/utils/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> | Partial<Task>) => void;
  task?: Task | null;
  initialStatus?: TaskStatus;
}

const TaskForm = ({ open, onOpenChange, onSubmit, task, initialStatus }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('feature');
  const [status, setStatus] = useState<TaskStatus>(initialStatus || 'todo');
  const [assigneeId, setAssigneeId] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setType(task.type);
      setStatus(task.status);
      setAssigneeId(task.assigneeId);
    } else {
      setTitle('');
      setDescription('');
      setType('feature');
      setStatus(initialStatus || 'todo');
      setAssigneeId('');
    }
  }, [task, initialStatus, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task) {
      onSubmit({
        id: task.id,
        title,
        description,
        type,
        status,
        assigneeId,
      });
    } else {
      onSubmit({
        title,
        description,
        type,
        status,
        assigneeId,
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Modifier la tâche' : 'Créer une nouvelle tâche'}</DialogTitle>
          <DialogDescription>
            {task ? 'Modifiez les détails de la tâche ci-dessous.' : 'Remplissez les détails pour créer une nouvelle tâche.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                placeholder="Titre de la tâche"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description de la tâche"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={type} onValueChange={(value) => setType(value as TaskType)}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Fonctionnalité</SelectItem>
                    <SelectItem value="improvement">Amélioration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">À faire</SelectItem>
                    <SelectItem value="inProgress">En cours</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                    <SelectItem value="done">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assigné à *</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Sélectionner un assigné" />
                </SelectTrigger>
                <SelectContent>
                  {storage.getUsers().map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {task ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
