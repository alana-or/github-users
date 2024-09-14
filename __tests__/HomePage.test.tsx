import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/pages/index';
import { Provider } from 'react-redux';
import store from '@/store/store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { addVisitedUser } from '@/store/historySlice';

const mockAxios = new MockAdapter(axios);

const initialUsers = [
  {
    login: 'user',
    avatar_url: 'https://avatars',
    name: 'User',
  },
];

describe('Home Page', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  test('should show error message when initialUsers is empty', async () => {
    render(
      <Provider store={store}>
        <Home initialUsers={[]} initialError="Falha ao carregar os usuários. Por favor, tente novamente mais tarde." />
      </Provider>
    );

    expect(await screen.findByText('Falha ao carregar os usuários. Por favor, tente novamente mais tarde.')).toBeInTheDocument();
  });

  test('should show error message when search API fails', async () => {
    mockAxios.onGet('/api/searchUsers').reply(500);

    render(
      <Provider store={store}>
        <Home initialUsers={initialUsers} initialError={null} />
      </Provider>
    );

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(screen.getByText('Falha ao pesquisar usuários. Por favor, tente novamente mais tarde.')).toBeInTheDocument();
    });
  });

  const mockUserResponse = [
    { login: 'user1', name: 'User 1' },
    { login: 'user2', name: 'User 2' },
  ];

  test('should revert to initial users when search query is cleared', async () => {
    render(
      <Provider store={store}>
        <Home initialUsers={initialUsers} initialError={null} />
      </Provider>
    );

    mockAxios.onGet('/api/searchUsers?query=test').reply(200, { items: [] });

    expect(screen.getByText('User')).toBeInTheDocument();

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.queryByText('User')).not.toBeInTheDocument();
    });

    mockAxios.onGet('/api/searchUsers?query=').reply(200, { items: mockUserResponse });

    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  test('should show and hide Loader component during search', async () => {
    render(
      <Provider store={store}>
        <Home initialUsers={initialUsers} initialError={null} />
      </Provider>
    );
  
    expect(screen.getByText('User')).toBeInTheDocument();
    
    const query = 'nova busca';
  
    mockAxios.onGet(`/api/searchUsers?query=${encodeURIComponent(query)}`).reply(() => {
      return new Promise((resolve) => setTimeout(() => resolve([200, []]), 2000));
    });
  
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: query } });

    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).toBeInTheDocument();
    }, { timeout: 3000 });
  
    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  
    expect(screen.queryByText('User')).not.toBeInTheDocument();
  });
  
  test('logs error details when search API fails', async () => {
    mockAxios.onGet('/api/searchUsers').reply(500);

    render(
      <Provider store={store}>
        <Home initialUsers={initialUsers} initialError={null} />
      </Provider>
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByText('Falha ao pesquisar usuários. Por favor, tente novamente mais tarde.')).toBeInTheDocument();
    });
  });

  test('handles user click and dispatches action', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(store, 'dispatch').mockImplementation(mockDispatch);

    render(
      <Provider store={store}>
        <Home initialUsers={initialUsers} initialError={null} />
      </Provider>
    );

    fireEvent.click(screen.getByText('User'));

    expect(mockDispatch).toHaveBeenCalledWith(addVisitedUser('user'));
  });
});
