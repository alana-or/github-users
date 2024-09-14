import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addVisitedUser } from '@/store/historySlice';
import { AppDispatch, RootState } from '@/store/store';
import axiosInstance from '../lib/axiosInstance';
import SearchInput from '@/components/SearchInput';
import { User } from '@/types/UserDetailProps';
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
        setFilteredUsers([]);
        setError('Falha ao pesquisar usuários. Por favor, tente novamente mais tarde.');
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
    <>
      <SearchInput onSearch={handleSearch} />

      {error && <ErrorMessage message={error} />}

      <UserList
          users={filteredUsers}
          visitedUsers={visitedUsers}
          handleClick={handleClick}
        />
    </>
  );
};

export async function getStaticProps() {
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
      revalidate: 3600, 
    };

  } catch (error) {
    return { 
      props: { initialUsers: [] },
      revalidate: 3600, 
    }; 
  }
}

export default Home;
