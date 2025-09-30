import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';
import { Task, TaskStatus } from '@/types';
import { mockUsers } from '@/data/mockUsers';
import KanbanBoard from './KanbanBoard';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LogOut, Filter, Plus, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialStatus, setInitialStatus] = useState<TaskStatus | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const handleCreateTask = (status?: TaskStatus) => {
    setEditingTask(null);
    setInitialStatus(status);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setInitialStatus(undefined);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast({
      title: 'Task deleted',
      description: 'The task has been removed.',
    });
  };

  const handleFormSubmit = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({
        title: 'Task updated',
        description: 'The task has been successfully updated.',
      });
    } else {
      addTask(taskData);
      toast({
        title: 'Task created',
        description: 'A new task has been added.',
      });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const assigneeMatch = filterAssignee === 'all' || task.assigneeId === filterAssignee;
    return statusMatch && assigneeMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">TeamBoard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Filters and Actions */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => handleCreateTask()} className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <main className="container mx-auto px-4 py-6">
        <KanbanBoard
          tasks={filteredTasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onCreateTask={handleCreateTask}
          onUpdateTaskStatus={(taskId, newStatus) => {
            updateTask(taskId, { status: newStatus });
            toast({
              title: 'Task moved',
              description: `Task status updated successfully.`,
            });
          }}
        />
      </main>

      {/* Task Form Dialog */}
      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        task={editingTask}
        initialStatus={initialStatus}
      />
    </div>
  );
};

export default Dashboard;
