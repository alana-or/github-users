import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import UserDetails from '@/components/UserDetails';

describe('UserDetails Component', () => {
  const mockUser = {
    login: 'ana_maria',
    name: 'Ana Maria',
    bio: 'Software Developer',
    company: 'OpenAI',
    location: 'San Francisco',
    email: 'ana.maria@example.com',
  };

  test('renders user details correctly', () => {
    render(<UserDetails user={mockUser} visitedUsers={[]} />);

    expect(screen.getByText('Ana Maria')).toBeInTheDocument();
    expect(screen.getByText('@ana_maria')).toBeInTheDocument();

    expect(screen.getByText('Software Developer')).toBeInTheDocument();

    expect(screen.getByText('Empresa: OpenAI')).toBeInTheDocument();

    expect(screen.getByText('Localização: San Francisco')).toBeInTheDocument();

    const emailLink = screen.getByText('ana.maria@example.com');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:ana.maria@example.com');
  });

  test('applies correct text color based on visitedUsers prop', () => {
    render(<UserDetails user={mockUser} visitedUsers={['ana_maria']} />);

    const userName = screen.getByText('Ana Maria');
    expect(userName).toHaveClass('text-blue-600');
  });

  test('does not apply blue text color if user is not visited', () => {
    render(<UserDetails user={mockUser} visitedUsers={[]} />);

    const userName = screen.getByText('Ana Maria');
    expect(userName).toHaveClass('text-gray-800');
  });

  test('does not render optional fields if not provided', () => {
    const userWithoutOptionalFields = {
      login: 'jane_lucia',
      name: 'Jane Lucia',
    };

    render(<UserDetails user={userWithoutOptionalFields} visitedUsers={[]} />);

    expect(screen.queryByText('Software Developer')).not.toBeInTheDocument();
    expect(screen.queryByText('Empresa: OpenAI')).not.toBeInTheDocument();
    expect(screen.queryByText('Localização: San Francisco')).not.toBeInTheDocument();
    expect(screen.queryByText('E-mail:')).not.toBeInTheDocument();
  });
});
