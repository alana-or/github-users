import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addVisitedUser } from '@/store/historySlice';
import { AppDispatch, RootState } from '@/store/store';
import axiosInstance from '../lib/axiosInstance';
import SearchInput from '@/components/SearchInput';
import { User } from '@/types/UserDetailProps';
import Heading from '@/components/Heading';
import UserList from '@/components/UserList';
import ErrorMessage from '@/components/ErrorMessage';

interface HomeProps {
  initialUsers: User[];
}

const Home = ({ initialUsers }: HomeProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const visitedUsers = useSelector((state: RootState) => state.history.visitedUsers);

  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!initialUsers || initialUsers.length === 0) {
      setError('Falha ao carregar os usuários. Por favor, tente novamente mais tarde.');
    }
  }, [initialUsers]);

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
        setError(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setFilteredUsers([]);
        setError('Falha ao carregar os usuários. Por favor, tente novamente mais tarde.');
      }
    } else {
      setFilteredUsers(initialUsers);
      setError(null);
    }
  };

  const handleClick = (login: string) => {
    dispatch(addVisitedUser(login));
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <Heading text="GitHub Usuários" />
      
      <SearchInput onSearch={handleSearch} />

      {error && <ErrorMessage message={error} />}

      <UserList
          users={filteredUsers}
          visitedUsers={visitedUsers}
          handleClick={handleClick}
        />
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
