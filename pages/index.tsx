import { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronRight } from 'react-icons/fa'; 
import { addVisitedUser } from '@/store/historySlice';
import { AppDispatch, RootState } from '@/store/store';
import axiosInstance from '../lib/axiosInstance';
import SearchInput from '@/components/search-input';
import { User } from '@/types/UserDetailProps';

interface HomeProps {
  initialUsers: User[];
}

const Home = ({ initialUsers }: HomeProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const visitedUsers = useSelector((state: RootState) => state.history.visitedUsers);

  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);

  const handleSearch = async (query: string) => {
    if (query) {
      try {
        const searchResult = await axiosInstance.get(`/search/users?q=${query}`);
        const usersData = searchResult.data.items;

        const userDetails = await Promise.all(
          usersData.map(async (user: { login: string }) => {
            const userRes = await axiosInstance.get(`/users/${user.login}`);
            return userRes.data;
          })
        );

        setFilteredUsers(userDetails);
      } catch (error) {
        console.error('Error fetching users:', error);
        setFilteredUsers([]);
      }
    } else {
      setFilteredUsers(initialUsers);
    }
  };

  const handleClick = (login: string) => {
    dispatch(addVisitedUser(login));
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">GitHub Usuários</h1>
      <SearchInput onSearch={handleSearch} />
      <ul className="w-full max-w-lg bg-white shadow-md rounded-lg overflow-hidden">
        {filteredUsers.map((user) => (
          <li
            key={user.login}
            className={`flex items-center p-4 border-b border-gray-200 ${
              visitedUsers.includes(user.login) ? 'bg-gray-100' : ''
            }`}
          >
            <Link
              href={`/users/${user.login}`}
              className="flex w-full items-center text-blue-600 hover:text-blue-800"
            >
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex flex-col flex-grow">
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

export async function getServerSideProps() {
  try {
    const result = await axiosInstance.get('/users');
    
    const users = await Promise.all(
      result.data.map(async (user: { login: string }) => {
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
}

export default Home;
