import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addVisitedUser } from '@/store/historySlice';
import { AppDispatch, RootState } from '@/store/store';
import axiosInstance from '../../lib/axiosInstance';
import { UserDetailProps } from '@/types/UserDetailProps';
import Heading from '@/components/Heading'; 
import UserAvatar from '@/components/UserAvatar'; 
import UserDetails from '@/components/UserDetails'; 
import ErrorMessage from '@/components/ErrorMessage';
import RepositoryList from '@/components/RepositoryList';

const UserDetail = ({ user, repos, error }: UserDetailProps & { error?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const visitedUsers = useSelector((state: RootState) => state.history.visitedUsers);

  useEffect(() => {
    if (user) {
      dispatch(addVisitedUser(user.login));
    }
  }, [dispatch, user, repos]);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <div className="flex flex-col items-start sm:w-3/4 lg:w-1/2">
        <Heading text="GitHub Usuários" />

        <Link href="/" className="text-blue-500 hover:underline mb-6">
          Voltar
        </Link>

       { error && <ErrorMessage message={error} />  }

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

        {repos && (
          <RepositoryList
            repos={repos}
          />
        )}
      </div>
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
    console.error('Erro ao carregar caminhos:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps(context: { params: { username: string } }) {
  try {
    const { username } = context.params;
    const userRes = await axiosInstance.get(`/users/${username}`);
    const reposRes = await axiosInstance.get(`/users/${username}/repos`);

    return {
      props: {
        user: userRes.data,
        repos: reposRes.data,
      },
      revalidate: 3600,
    };

  } catch (error) {
    console.error('Erro ao carregar:', error);

    return {
      props: {
        user: null,
        repos: [],
        error: 'Erro ao carregar os dados. Por favor, tente novamente.',
      },
      revalidate: 3600,
    };
  }
}

export default UserDetail;
