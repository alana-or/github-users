import { GetServerSideProps } from 'next';
import { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import SearchInput from '@/components/search-input';

interface User {
  login: string;
  name: string; 
  avatar_url: string; 
}

interface OtherPageProps {
  initialUsers: User[];
}

const OtherPage = ({ initialUsers }: OtherPageProps) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);

  const handleSearch = async (usersData: User[]) => {
    setFilteredUsers(usersData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">GitHub Usuários</h1>
      <SearchInput onSearch={handleSearch} />
      <ul className="w-full max-w-lg bg-white shadow-md rounded-lg overflow-hidden">
        {filteredUsers.map((user) => (
          <li key={user.login} className="flex w-full items-center justify-between p-4 border-b border-gray-200">
            <Link href={`/users/${user.login}`} className="text-blue-600 hover:text-blue-800 flex items-center">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex flex-col">
                <span className="font-medium">{user.name || user.login}</span>
                <span className="text-gray-500">@{user.login}</span>
              </div>
              <FaChevronRight className="ml-2 text-gray-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<OtherPageProps> = async () => {
  try {
    const result = await axiosInstance.get('/users');
    const users = await Promise.all(
      result.data.map(async (user: User) => {
        const userResult = await axiosInstance.get(`/users/${user.login}`);
        return userResult.data;
      })
    );

    return {
      props: {
        initialUsers: users,
      },
    };

  } catch (error) {
    console.error('Error loading:', error);
    return { props: { initialUsers: [] } };
  }
};

export default OtherPage;
