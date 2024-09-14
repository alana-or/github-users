import React from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import UserAvatar from './UserAvatar';

interface UserListItemProps {
  user: {
    login: string;
    avatar_url: string;
    name: string | null;
  };
  isVisited: boolean;
  onClick: (login: string) => void;
}

const UserListItem = ({ user, isVisited, onClick }: UserListItemProps) => {
  return (
    <li
      className={`flex items-center p-4 border-b border-gray-200 ${isVisited ? 'bg-gray-100' : ''}`}
      onClick={() => onClick(user.login)}
    >
      <Link
        href={`/users/${user.login}`}
        className="flex w-full items-center text-blue-600 hover:text-blue-800"
      >
        <UserAvatar
          src={user.avatar_url}
          alt={user.login}
          className="mr-6 w-12 h-12"
        />

        <div className="flex flex-col flex-grow">
          <span className="font-medium">{user.name || user.login}</span>
          <span className="text-gray-500">@{user.login}</span>
        </div>
        
        <FaChevronRight className="ml-2 text-gray-400" />
      </Link>
    </li>
  );
};

export default UserListItem;
