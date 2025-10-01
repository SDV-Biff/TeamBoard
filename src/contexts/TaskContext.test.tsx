import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { TaskProvider, useTasks } from '@/contexts/TaskContext';
import { storage } from '@/utils/localStorage';
import { Task } from '@/types';

// Mock du module storage
vi.mock('@/utils/localStorage', () => ({
  storage: {
    getTasks: vi.fn(),
    saveTasks: vi.fn(),
  },
}));

describe('TaskContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <TaskProvider>{children}</TaskProvider>
  );

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Description 1',
      type: 'feature',
      status: 'todo',
      assigneeId: 'user1',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Description 2',
      type: 'bug',
      status: 'inProgress',
      assigneeId: 'user2',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date.now et new Date() pour des résultats prévisibles
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useTasks hook', () => {
    it('should throw error when used outside TaskProvider', () => {
      expect(() => {
        renderHook(() => useTasks());
      }).toThrow('useTasks must be used within a TaskProvider');
    });

    it('should load tasks from localStorage on mount', () => {
      (storage.getTasks as any).mockReturnValue(mockTasks);

      const { result } = renderHook(() => useTasks(), { wrapper });

      expect(storage.getTasks).toHaveBeenCalled();
      expect(result.current.tasks).toEqual(mockTasks);
    });

    it('should start with empty tasks when localStorage is empty', () => {
      (storage.getTasks as any).mockReturnValue([]);

      const { result } = renderHook(() => useTasks(), { wrapper });

      expect(result.current.tasks).toEqual([]);
    });
  });

  describe('addTask function', () => {
    it('should add a new task with generated id and timestamps', () => {
      (storage.getTasks as any).mockReturnValue([]);

      const { result } = renderHook(() => useTasks(), { wrapper });

      const newTaskData = {
        title: 'New Task',
        description: 'New Description',
        type: 'feature' as const,
        status: 'todo' as const,
        assigneeId: 'user1',
      };

      act(() => {
        result.current.addTask(newTaskData);
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0]).toEqual({
        ...newTaskData,
        id: expect.any(String),
        createdAt: '2023-01-01T12:00:00.000Z',
        updatedAt: '2023-01-01T12:00:00.000Z',
      });
      expect(storage.saveTasks).toHaveBeenCalledWith(result.current.tasks);
    });

    it('should add task to existing tasks list', () => {
      (storage.getTasks as any).mockReturnValue(mockTasks);

      const { result } = renderHook(() => useTasks(), { wrapper });

      const newTaskData = {
        title: 'New Task',
        description: 'New Description',
        type: 'improvement' as const,
        status: 'todo' as const,
        assigneeId: 'user3',
      };

      act(() => {
        result.current.addTask(newTaskData);
      });

      expect(result.current.tasks).toHaveLength(3);
      expect(result.current.tasks[2]).toEqual({
        ...newTaskData,
        id: expect.any(String),
        createdAt: '2023-01-01T12:00:00.000Z',
        updatedAt: '2023-01-01T12:00:00.000Z',
      });
    });
  });

  describe('updateTask function', () => {
    it('should update existing task', () => {
      (storage.getTasks as any).mockReturnValue(mockTasks);

      const { result } = renderHook(() => useTasks(), { wrapper });

      const updates = {
        title: 'Updated Title',
        status: 'done' as const,
      };

      act(() => {
        result.current.updateTask('1', updates);
      });

      const updatedTask = result.current.tasks.find(task => task.id === '1');
      expect(updatedTask).toEqual({
        ...mockTasks[0],
        ...updates,
        updatedAt: '2023-01-01T12:00:00.000Z',
      });
      expect(storage.saveTasks).toHaveBeenCalledWith(result.current.tasks);
    });

    it('should not update non-existent task', () => {
      (storage.getTasks as any).mockReturnValue(mockTasks);

      const { result } = renderHook(() => useTasks(), { wrapper });

      const originalTasks = [...result.current.tasks];

      act(() => {
        result.current.updateTask('nonexistent', { title: 'Updated' });
      });

      expect(result.current.tasks).toEqual(originalTasks);
    });

    it('should update only specified fields', () => {
      (storage.getTasks as any).mockReturnValue(mockTasks);

      const { result } = renderHook(() => useTasks(), { wrapper });

      act(() => {
        result.current.updateTask('1', { status: 'done' });
      });

      const updatedTask = result.current.tasks.find(task => task.id === '1');
      expect(updatedTask).toEqual({
        ...mockTasks[0],
        status: 'done',
        updatedAt: '2023-01-01T12:00:00.000Z',
      });
      // Vérifier que les autres champs n'ont pas changé
      expect(updatedTask?.title).toBe(mockTasks[0].title);
      expect(updatedTask?.description).toBe(mockTasks[0].description);
    });
  });

  describe('deleteTask function', () => {
    it('should delete existing task', () => {
      (storage.getTasks as any).mockReturnValue(mockTasks);

      const { result } = renderHook(() => useTasks(), { wrapper });

      expect(result.current.tasks).toHaveLength(2);

      act(() => {
        result.current.deleteTask('1');
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks.find(task => task.id === '1')).toBeUndefined();
      expect(result.current.tasks[0].id).toBe('2');
      expect(storage.saveTasks).toHaveBeenCalledWith(result.current.tasks);
    });

    it('should not affect tasks when deleting non-existent task', () => {
      (storage.getTasks as any).mockReturnValue(mockTasks);

      const { result } = renderHook(() => useTasks(), { wrapper });

      const originalTasks = [...result.current.tasks];

      act(() => {
        result.current.deleteTask('nonexistent');
      });

      expect(result.current.tasks).toEqual(originalTasks);
    });

    it('should handle deleting from empty tasks list', () => {
      (storage.getTasks as any).mockReturnValue([]);

      const { result } = renderHook(() => useTasks(), { wrapper });

      act(() => {
        result.current.deleteTask('1');
      });

      expect(result.current.tasks).toEqual([]);
    });
  });

  describe('localStorage integration', () => {
    it('should save tasks to localStorage when tasks change', () => {
      (storage.getTasks as any).mockReturnValue([]);

      const { result } = renderHook(() => useTasks(), { wrapper });

      const newTaskData = {
        title: 'Test Task',
        description: 'Test Description',
        type: 'feature' as const,
        status: 'todo' as const,
        assigneeId: 'user1',
      };

      act(() => {
        result.current.addTask(newTaskData);
      });

      expect(storage.saveTasks).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining(newTaskData)
        ])
      );
    });
  });
});