import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import Register from './components/Register';

beforeEach(() => {
  localStorage.clear();
});

test('shows the login form by default when no one is signed in', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /welcome back/i });
  expect(heading).toBeInTheDocument();
});

test('renders email and password fields on the login page', () => {
  render(<App />);
  expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
});

test('links to the register page from login', () => {
  render(<App />);
  const registerLink = screen.getByRole('link', { name: /register here/i });
  expect(registerLink).toHaveAttribute('href', '/register');
});

test('register form includes Admin, User, and Employee role options', () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
  const roleSelect = screen.getByLabelText(/account type/i);
  expect(roleSelect).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Admin' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'User' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Employee' })).toBeInTheDocument();
});