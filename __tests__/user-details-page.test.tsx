import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '@/store/store'; 
import { addVisitedUser } from '@/store/historySlice';
import UserDetail from '@/pages/users/[username]';

jest.mock('../lib/axiosInstance', () => ({
  get: jest.fn(),
}));

const mockAxios = require('../lib/axiosInstance');

const mockUser = {
  login: 'user',
  avatar_url: 'https://avatars',
  name: 'User',
  bio: 'Bio of User',
  company: 'Company Inc.',
  location: 'Location City',
  email: 'user@example.com',
};

const mockRepos = [
  { id: 1, name: 'Repo1', html_url: 'https://github.com/user/repo1' },
  { id: 2, name: 'Repo2', html_url: 'https://github.com/user/repo2' },
];

describe('UserDetail Page', () => {
  beforeEach(() => {
    mockAxios.get.mockReset();
  });

  it('renders "Voltar" link and navigates to the home page', () => {
    mockAxios.get.mockImplementation((url: string | string[]) => {
      if (url.includes('/users/user')) {
        return Promise.resolve({ data: mockUser });
      }
      if (url.includes('/users/user/repos')) {
        return Promise.resolve({ data: mockRepos });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <Provider store={store}>
        <UserDetail user={mockUser} repos={[]} />
      </Provider>
    );

    const backLink = screen.getByText('Voltar');
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('renders user details correctly', async () => {
    mockAxios.get.mockImplementation((url: string | string[]) => {
      if (url.includes('/users/user')) {
        return Promise.resolve({ data: mockUser });
      }
      if (url.includes('/users/user/repos')) {
        return Promise.resolve({ data: mockRepos });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <Provider store={store}>
        <UserDetail user={mockUser} repos={mockRepos} />
      </Provider>
    );

    expect(screen.getByText('GitHub Usuários')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('@user')).toBeInTheDocument();
    expect(screen.getByText('Bio of User')).toBeInTheDocument();
    expect(screen.getByText('Empresa: Company Inc.')).toBeInTheDocument();
    expect(screen.getByText('Localização: Location City')).toBeInTheDocument();
    
    const emailLink = screen.getByRole('link', { name: 'user@example.com' });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:user@example.com');

    expect(screen.getByText('Repo1')).toBeInTheDocument();
    expect(screen.getByText('Repo2')).toBeInTheDocument();
  });

  //se usuário acessar a página somente pela url, não ocorreu o dspatch do click na página index
  //pode parecer redundante, mas é pra garantir essa ação fora do clique
  it('dispatches addVisitedUser action on component mount', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(store, 'dispatch').mockImplementation(mockDispatch);

    render(
      <Provider store={store}>
        <UserDetail user={mockUser} repos={mockRepos} />
      </Provider>
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(addVisitedUser('user'));
    });
  });
});