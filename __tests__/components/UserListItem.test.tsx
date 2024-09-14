import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import UserListItem from '@/components/UserListItem';

jest.mock('../../components/UserAvatar', () => (props: any) => (
  <img src={props.src} alt={props.alt} className={props.className} />
));

describe('UserListItem Component', () => {
  const mockUser = {
    login: 'julia_souza',
    avatar_url: 'https://example.com/julia.jpg',
    name: 'Julia Souza',
  };
  const mockHandleClick = jest.fn();

  test('renders user details correctly', () => {
    render(<UserListItem user={mockUser} isVisited={false} onClick={mockHandleClick} />);

    expect(screen.getByAltText('julia_souza')).toBeInTheDocument();
    expect(screen.getByText('Julia Souza')).toBeInTheDocument();
    expect(screen.getByText('@julia_souza')).toBeInTheDocument();
  });

  test('applies correct background color when user is visited', () => {
    render(<UserListItem user={mockUser} isVisited={true} onClick={mockHandleClick} />);

    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('bg-gray-100');
  });

  test('does not apply background color when user is not visited', () => {
    render(<UserListItem user={mockUser} isVisited={false} onClick={mockHandleClick} />);

    const listItem = screen.getByRole('listitem');
    expect(listItem).not.toHaveClass('bg-gray-100');
  });

  test('calls onClick function with user login when item is clicked', () => {
    render(<UserListItem user={mockUser} isVisited={false} onClick={mockHandleClick} />);

    fireEvent.click(screen.getByRole('listitem'));

    expect(mockHandleClick).toHaveBeenCalledWith('julia_souza');
  });
});
