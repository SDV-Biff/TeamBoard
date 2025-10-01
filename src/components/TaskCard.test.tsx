import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import TaskCard from '@/components/TaskCard';
import { Task } from '@/types';

// Mock des modules
vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Translate: {
      toString: vi.fn(() => ''),
    },
  },
}));

vi.mock('@/data/mockUsers', () => ({
  mockUsers: [
    {
      id: 'user1',
      username: 'testuser',
      name: 'Test User',
      password: 'test',
    },
    {
      id: 'user2',
      username: 'admin',
      name: 'Admin User',
      password: 'admin',
    },
  ],
}));

describe('TaskCard', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'This is a test task description',
    type: 'feature',
    status: 'todo',
    assigneeId: 'user1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render task information correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task description')).toBeInTheDocument();
    expect(screen.getByText('Feature')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should display correct badge for different task types', () => {
    const bugTask = { ...mockTask, type: 'bug' as const };
    const { rerender } = render(
      <TaskCard
        task={bugTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Bug')).toBeInTheDocument();

    const improvementTask = { ...mockTask, type: 'improvement' as const };
    rerender(
      <TaskCard
        task={improvementTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Improvement')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const buttons = screen.getAllByRole('button');
    const editButton = buttons[0]; // Premier bouton = edit
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons[1]; // Deuxième bouton = delete
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('should display assignee name when assignee exists', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should handle task without assignee', () => {
    const taskWithoutAssignee = { ...mockTask, assigneeId: 'nonexistent' };
    
    render(
      <TaskCard
        task={taskWithoutAssignee}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Le composant devrait toujours s'afficher même sans assigné valide
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task card components', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Vérifier que les éléments principaux sont rendus
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task description')).toBeInTheDocument();
  });

  it('should have proper buttons available', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2); // Edit et Delete buttons

    // Vérifier que les boutons ont les icônes appropriées
    expect(buttons[0]).toBeInTheDocument(); // Edit button
    expect(buttons[1]).toBeInTheDocument(); // Delete button
  });
});