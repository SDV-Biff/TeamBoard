import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render as renderRTL, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '@/components/Login';

// Mock du hook useAuth
const mockLogin = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock du hook useToast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper personnalisé pour ce test seulement
const renderWithRouter = (component: React.ReactElement) => {
  return renderRTL(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form correctly', () => {
    renderWithRouter(<Login />);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to manage your tasks')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should update input values when typing', () => {
    renderWithRouter(<Login />);

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpass');
  });

  it('should call login function with correct credentials on form submit', () => {
    mockLogin.mockReturnValue(true);
    
    renderWithRouter(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('testuser', 'testpass');
  });

  it('should navigate to dashboard on successful login', async () => {
    mockLogin.mockReturnValue(true);
    
    renderWithRouter(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not navigate on failed login', () => {
    mockLogin.mockReturnValue(false);
    
    renderWithRouter(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle form submission with Enter key', () => {
    mockLogin.mockReturnValue(true);
    
    renderWithRouter(<Login />);

    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    
    if (form) {
      fireEvent.submit(form);
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'testpass');
    }
  });

  it('should handle empty form submission', () => {
    renderWithRouter(<Login />);

    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
    
    if (form) {
      fireEvent.submit(form);
      expect(mockLogin).toHaveBeenCalledWith('', '');
    }
  });

  it('should display login form elements with correct attributes', () => {
    renderWithRouter(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(usernameInput).toHaveAttribute('type', 'text');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should render signup link', () => {
    renderWithRouter(<Login />);

    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
});