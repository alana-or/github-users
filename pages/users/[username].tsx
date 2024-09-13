import { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addVisitedUser } from '@/store/historySlice';
import { AppDispatch, RootState } from '@/store/store';
import axiosInstance from '../../lib/axiosInstance';
import { UserDetailProps } from '@/types/UserDetailProps';

const UserDetail = ({ user, repos }: UserDetailProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const visitedUsers = useSelector((state: RootState) => state.history.visitedUsers);

  useEffect(() => {
    dispatch(addVisitedUser(user.login));
  }, [dispatch, user.login]);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
  <div className="flex flex-col items-start sm:w-3/4 lg:w-1/2">
    <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center w-full">GitHub Usuários</h1>
    
    <div className="mb-6">
      <Link href="/" className="text-blue-500 hover:underline">
        Voltar
      </Link>
    </div>
    
    <div className="flex items-start mb-6">
      <img
        src={user.avatar_url}
        alt={user.login}
        className="w-24 h-24 rounded-full mr-6"
      />
      <div className="flex flex-col">
        <h2 className={`text-2xl font-bold ${visitedUsers.includes(user.login) ? 'text-blue-600' : 'text-gray-800'}`}>
          {user.name || user.login}
        </h2>
        <p className="text-gray-600 mb-2">@{user.login}</p>
        {user.bio && <p className="text-gray-700 mb-2">{user.bio}</p>}
        {user.company && <p className="text-gray-600 mb-2">Empresa: {user.company}</p>}
        {user.location && <p className="text-gray-600 mb-2">Localização: {user.location}</p>}
        {user.email && <p className="text-gray-600 mb-2">E-mail: <a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">{user.email}</a></p>}
      </div>
    </div>
    
    <div className="w-full">
      <h3 className="text-xl font-bold mb-4 text-center">Repositórios</h3>
      <ul className="list-disc pl-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-lg mx-auto">
        {repos.map((repo) => (
          <li key={repo.id} className="mb-2">
            <Link href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {repo.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
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
      },
      revalidate: 3600,
    };
  }
}

export default UserDetail;
