import { Task, User } from '@/types';

const STORAGE_KEYS = {
  TASKS: 'teamboard_tasks',
  CURRENT_USER: 'teamboard_current_user',
  USERS: 'teamboard_users',
};

export const storage = {
  // Tasks
  getTasks: (): Task[] => {
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks) : [];
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  // User
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  saveCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Users (for registration)
  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    if (users) {
      return JSON.parse(users);
    }
    // Return mockUsers as default
    const { mockUsers } = require('@/data/mockUsers');
    return mockUsers;
  },

  saveUser: (user: User): void => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
};
