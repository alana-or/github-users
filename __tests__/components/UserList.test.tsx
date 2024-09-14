import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import UserList from '@/components/UserList';

jest.mock('../../components/UserListItem', () => (props: any) => (
  <li>
    <button onClick={() => props.onClick(props.user.login)}>{props.user.name || props.user.login}</button>
  </li>
));

describe('UserList Component', () => {
  const mockUsers = [
    { login: 'ana_maria', avatar_url: 'https://example.com/ana.jpg', name: 'Ana Maria' },
    { login: 'Julia Souza', avatar_url: 'https://example.com/julia.jpg', name: 'Julia Souza' },
  ];
  const mockVisitedUsers = ['ana_maria'];
  const mockHandleClick = jest.fn();

  test('renders list of users', () => {
    render(<UserList users={mockUsers} visitedUsers={mockVisitedUsers} handleClick={mockHandleClick} />);

    expect(screen.getByText('Ana Maria')).toBeInTheDocument();
    expect(screen.getByText('Julia Souza')).toBeInTheDocument();
  });

  test('calls handleClick function when user item is clicked', () => {
    render(<UserList users={mockUsers} visitedUsers={mockVisitedUsers} handleClick={mockHandleClick} />);

    fireEvent.click(screen.getByText('Ana Maria'));

    expect(mockHandleClick).toHaveBeenCalledWith('ana_maria');
  });
});
