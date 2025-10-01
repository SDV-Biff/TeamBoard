import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from '@/utils/localStorage';
import { Task, User } from '@/types';

describe('localStorage utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tasks', () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        type: 'feature',
        status: 'todo',
        assigneeId: 'user1',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        title: 'Another Task',
        description: 'Another Description',
        type: 'bug',
        status: 'inProgress',
        assigneeId: 'user2',
        createdAt: '2023-01-02T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      },
    ];

    it('should save tasks to localStorage', () => {
      storage.saveTasks(mockTasks);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'teamboard_tasks',
        JSON.stringify(mockTasks)
      );
    });

    it('should get tasks from localStorage', () => {
      (localStorage.getItem as any).mockReturnValue(JSON.stringify(mockTasks));
      
      const result = storage.getTasks();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('teamboard_tasks');
      expect(result).toEqual(mockTasks);
    });

    it('should return empty array when no tasks in localStorage', () => {
      (localStorage.getItem as any).mockReturnValue(null);
      
      const result = storage.getTasks();
      
      expect(result).toEqual([]);
    });

    it('should handle JSON parse errors gracefully', () => {
      (localStorage.getItem as any).mockReturnValue('invalid-json');
      
      expect(() => storage.getTasks()).toThrow();
    });
  });

  describe('Current User', () => {
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      password: '',
      name: 'Test User',
      avatar: 'avatar.jpg',
    };

    it('should save current user to localStorage', () => {
      storage.saveCurrentUser(mockUser);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'teamboard_current_user',
        JSON.stringify(mockUser)
      );
    });

    it('should get current user from localStorage', () => {
      (localStorage.getItem as any).mockReturnValue(JSON.stringify(mockUser));
      
      const result = storage.getCurrentUser();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('teamboard_current_user');
      expect(result).toEqual(mockUser);
    });

    it('should return null when no current user in localStorage', () => {
      (localStorage.getItem as any).mockReturnValue(null);
      
      const result = storage.getCurrentUser();
      
      expect(result).toBeNull();
    });

    it('should remove current user when saving null', () => {
      storage.saveCurrentUser(null);
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('teamboard_current_user');
    });

    it('should handle JSON parse errors gracefully', () => {
      (localStorage.getItem as any).mockReturnValue('invalid-json');
      
      expect(() => storage.getCurrentUser()).toThrow();
    });
  });
});