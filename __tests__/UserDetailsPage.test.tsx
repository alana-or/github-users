import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '@/store/store'; 
import { addVisitedUser } from '@/store/historySlice';
import UserDetail from '@/pages/users/[username]';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);

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
    mockAxios.reset(); 
  });

  it('shows an error message if fetching user data fails', async () => {
    mockAxios.onGet('/users/user').reply(500);

    render(
      <Provider store={store}>
        <UserDetail user={null} repos={[]} error="Erro ao carregar os dados. Por favor, tente novamente." />
      </Provider>
    );

    expect(screen.getByText('Erro ao carregar os dados. Por favor, tente novamente.')).toBeInTheDocument();
  });

  it('shows an error message if fetching user repos fails', async () => {
    mockAxios.onGet('/users/user').reply(200, mockUser);
    mockAxios.onGet('/users/user/repos').reply(500);

    render(
      <Provider store={store}>
        <UserDetail user={mockUser} repos={[]} error="Erro ao carregar os dados. Por favor, tente novamente." />
      </Provider>
    );

    expect(screen.getByText('Erro ao carregar os dados. Por favor, tente novamente.')).toBeInTheDocument();
  });

  it('renders "Voltar" link and navigates to the home page', async () => {
    mockAxios.onGet('/users/user').reply(200, mockUser);
    mockAxios.onGet('/users/user/repos').reply(200, mockRepos);

    render(
      <Provider store={store}>
        <UserDetail user={mockUser} repos={mockRepos} />
      </Provider>
    );

    const backLink = screen.getByText('Voltar');
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('renders user details correctly', async () => {
    mockAxios.onGet('/users/user').reply(200, mockUser);
    mockAxios.onGet('/users/user/repos').reply(200, mockRepos);

    render(
      <Provider store={store}>
        <UserDetail user={mockUser} repos={mockRepos} />
      </Provider>
    );

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

  it('dispatches addVisitedUser action on component mount', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(store, 'dispatch').mockImplementation(mockDispatch);

    mockAxios.onGet('/users/user').reply(200, mockUser);
    mockAxios.onGet('/users/user/repos').reply(200, mockRepos);

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
