import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/localStorage';
import { mockUsers } from '@/data/mockUsers';

// Mock du module storage
vi.mock('@/utils/localStorage', () => ({
  storage: {
    getCurrentUser: vi.fn(),
    saveCurrentUser: vi.fn(),
    getUsers: vi.fn(),
    saveUser: vi.fn(),
  },
}));

// Mock des données utilisateur
vi.mock('@/data/mockUsers', () => ({
  mockUsers: [
    {
      id: '1',
      username: 'testuser',
      password: 'testpass',
      name: 'Test User',
    },
    {
      id: '2',
      username: 'admin',
      password: 'admin123',
      name: 'Admin User',
    },
  ],
}));

describe('AuthContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
    });

    it('should provide initial authentication state', () => {
      (storage.getCurrentUser as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should restore user from localStorage on mount', () => {
      const savedUser = { id: '1', username: 'testuser', password: '', name: 'Test User' };
      (storage.getCurrentUser as any).mockReturnValue(savedUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toEqual(savedUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('login function', () => {
    it('should login with valid credentials', () => {
      (storage.getCurrentUser as any).mockReturnValue(null);
      (storage.getUsers as any).mockReturnValue([
        {
          id: '1',
          username: 'testuser',
          password: 'testpass',
          name: 'Test User',
        },
        {
          id: '2',
          username: 'admin',
          password: 'admin123',
          name: 'Admin User',
        },
      ]);

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        const success = result.current.login('testuser', 'testpass');
        expect(success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({
        id: '1',
        username: 'testuser',
        password: '',
        name: 'Test User',
      });
      expect(storage.saveCurrentUser).toHaveBeenCalledWith({
        id: '1',
        username: 'testuser',
        password: '',
        name: 'Test User',
      });
    });

    it('should not login with invalid credentials', () => {
      (storage.getCurrentUser as any).mockReturnValue(null);
      (storage.getUsers as any).mockReturnValue([
        {
          id: '1',
          username: 'testuser',
          password: 'testpass',
          name: 'Test User',
        },
        {
          id: '2',
          username: 'admin',
          password: 'admin123',
          name: 'Admin User',
        },
      ]);

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        const success = result.current.login('wronguser', 'wrongpass');
        expect(success).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(storage.saveCurrentUser).not.toHaveBeenCalled();
    });

    it('should not login with valid username but invalid password', () => {
      (storage.getCurrentUser as any).mockReturnValue(null);
      (storage.getUsers as any).mockReturnValue([
        {
          id: '1',
          username: 'testuser',
          password: 'testpass',
          name: 'Test User',
        },
        {
          id: '2',
          username: 'admin',
          password: 'admin123',
          name: 'Admin User',
        },
      ]);

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        const success = result.current.login('testuser', 'wrongpass');
        expect(success).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should clear password from saved user data', () => {
      (storage.getCurrentUser as any).mockReturnValue(null);
      (storage.getUsers as any).mockReturnValue([
        {
          id: '1',
          username: 'testuser',
          password: 'testpass',
          name: 'Test User',
        },
        {
          id: '2',
          username: 'admin',
          password: 'admin123',
          name: 'Admin User',
        },
      ]);

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login('testuser', 'testpass');
      });

      expect(storage.saveCurrentUser).toHaveBeenCalledWith(
        expect.objectContaining({
          password: '',
        })
      );
    });
  });

  describe('logout function', () => {
    it('should logout and clear user data', () => {
      const savedUser = { id: '1', username: 'testuser', password: '', name: 'Test User' };
      (storage.getCurrentUser as any).mockReturnValue(savedUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Vérifier que l'utilisateur est connecté
      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(storage.saveCurrentUser).toHaveBeenCalledWith(null);
    });
  });

  describe('isAuthenticated property', () => {
    it('should be true when user is logged in', () => {
      const savedUser = { id: '1', username: 'testuser', password: '', name: 'Test User' };
      (storage.getCurrentUser as any).mockReturnValue(savedUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should be false when user is not logged in', () => {
      (storage.getCurrentUser as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});