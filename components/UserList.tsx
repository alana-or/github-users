import React from 'react';
import UserListItem from './UserListItem';

interface UserListProps {
  users: {
    login: string;
    avatar_url: string;
    name: string | null;
  }[];
  visitedUsers: string[];
  handleClick: (login: string) => void;
}

const UserList = ({ users, visitedUsers, handleClick }: UserListProps) => {
  return (
    <ul className="w-full max-w-lg bg-white shadow-md rounded-lg overflow-hidden">
      {users.map((user) => (
        <UserListItem
          key={user.login}
          user={user}
          isVisited={visitedUsers.includes(user.login)}
          onClick={handleClick}
        />
      ))}
    </ul>
  );
};

export default UserList;
