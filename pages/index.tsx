import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addVisitedUser } from '@/store/historySlice';
import { AppDispatch, RootState } from '@/store/store';
import axiosInstance from '../lib/axiosInstance';
import SearchInput from '@/components/SearchInput';
import { User } from '@/types/UserDetailProps';
import UserList from '@/components/UserList';
import ErrorMessage from '@/components/ErrorMessage';
import Loader from '@/components/Loader'; 
import debouncedSearch from './api/debouncedSearch';

interface HomeProps {
  initialUsers: User[];
  initialError: string | null;
}

const Home = ({ initialUsers, initialError }: HomeProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const visitedUsers = useSelector((state: RootState) => state.history.visitedUsers);

  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!initialUsers || initialUsers.length === 0) {
      setError('Falha ao carregar os usuários. Por favor, tente novamente mais tarde.');
    }
  }, [initialUsers]);
  
  const handleSearch = useCallback((query: string) => {
    debouncedSearch(query, setLoading, setFilteredUsers, setError, initialUsers);
  }, [initialUsers]);

  const handleClick = (login: string) => {
    dispatch(addVisitedUser(login));
  };

  return (
    <>
      <SearchInput onSearch={handleSearch} />

      {error && (
        <div className='w-lg'>
          <ErrorMessage message={error} />
        </div>
      )}

      {loading && <Loader />}

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
        try {
          const userResult = await axiosInstance.get(`/users/${user.login}`);
          return userResult.data;
        } catch (err) {
          console.error(`Erro ao buscar detalhes do usuário ${user.login}:`, err);
          return null;
        }
      })
    );
    
    const validUsers = users.filter((user): user is User => user !== null);

    return {
      props: {
        initialUsers: validUsers,
        initialError: null,
      },
      revalidate: 3600, 
    };
  } catch (error) {
    return { 
      props: { 
        initialUsers: [],
        initialError: 'Falha ao carregar os usuários. Por favor, tente novamente mais tarde.',
      },
      revalidate: 3600,
    }; 
  }
}

export default Home;
