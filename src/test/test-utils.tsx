import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';

// Provider personnalisé qui englobe tous les contexts
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <AuthProvider>
        <TaskProvider>
          {children}
        </TaskProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };