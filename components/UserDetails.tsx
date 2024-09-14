import React from 'react';

interface UserDetailsProps {
  user: {
    login: string;
    name?: string;
    bio?: string;
    company?: string;
    location?: string;
    email?: string;
  };
  visitedUsers: string[];
}

const UserDetails = ({ user, visitedUsers }: UserDetailsProps) => {
  return (
    <div>
      <h2 className={`text-2xl font-bold ${visitedUsers.includes(user.login) ? 'text-blue-600' : 'text-gray-800'}`}>
        {user.name || user.login}
      </h2>
      <p className="text-gray-600 mb-2">@{user.login}</p>
      {user.bio && <p className="text-gray-700 mb-2">{user.bio}</p>}
      {user.company && <p className="text-gray-600 mb-2">Empresa: {user.company}</p>}
      {user.location && <p className="text-gray-600 mb-2">Localização: {user.location}</p>}
      {user.email && <p className="text-gray-600 mb-2">E-mail: <a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">{user.email}</a></p>}
    </div>
  );
};

export default UserDetails;
