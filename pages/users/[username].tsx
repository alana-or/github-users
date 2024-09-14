import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addVisitedUser } from '@/store/historySlice';
import { AppDispatch, RootState } from '@/store/store';
import axiosInstance from '../../lib/axiosInstance';
import { UserDetailProps } from '@/types/UserDetailProps';
import UserAvatar from '@/components/UserAvatar'; 
import UserDetails from '@/components/UserDetails'; 
import ErrorMessage from '@/components/ErrorMessage';
import RepositoryList from '@/components/RepositoryList';

interface UserDetailPropsWithError extends UserDetailProps {
  error?: string;
}

const UserDetail = ({ user, repos, error }: UserDetailPropsWithError) => {
  const dispatch = useDispatch<AppDispatch>();
  const visitedUsers = useSelector((state: RootState) => state.history.visitedUsers);

  useEffect(() => {
    if (user) {
      dispatch(addVisitedUser(user.login));
    }
  }, [dispatch, user]);

  return (
    <div className="flex flex-col items-start sm:w-3/4 lg:w-1/2">
      <Link href="/" className="text-blue-500 hover:underline mb-6">
        Voltar
      </Link>

      {error && <ErrorMessage message={error} />}

      <div className="flex items-start mb-6">
        {user && (
          <>
            <UserAvatar
              src={user.avatar_url}
              alt={user.login}
              className="mr-6 w-24 h-24"
            />
            <UserDetails
              user={user}
              visitedUsers={visitedUsers}
            />
          </>
        )}
      </div>

      {repos && repos.length > 0 && (
        <RepositoryList
          repos={repos}
        />
      )}
    </div>
  );
};

export async function getStaticPaths() {
  try {
    const res = await axiosInstance.get('/users');
    const users = res.data;

    const paths = users.map((user: { login: string }) => ({
      params: { username: user.login },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps(context: { params: { username: string } }) {
  const { username } = context.params;

  let user = null;
  let repos = [];
  let error = null;

  try {
    const userRes = await axiosInstance.get(`/users/${username}`);
    user = userRes.data;
  } catch (err) {
    error = 'Erro ao carregar os dados do usuário. Por favor, tente novamente.';
  }

  try {
    const reposRes = await axiosInstance.get(`/users/${username}/repos`);
    repos = reposRes.data;
  } catch (err) {
    error = 'Erro ao carregar os repositórios. Por favor, tente novamente.';
  }

  return {
    props: {
      user,
      repos,
      error,
    },
    revalidate: 3600,
  };
}

export default UserDetail;
