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
        <Home initialUsers={[]} />
      </Provider>
    );

    expect(await screen.findByText('Falha ao carregar os usuários. Por favor, tente novamente mais tarde.')).toBeInTheDocument();
  });

  test('should show error message when search API fails', async () => {
    mockAxios.onGet('/search/users').reply(500);

    render(
      <Provider store={store}>
        <Home initialUsers={initialUsers} />
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
        <Home initialUsers={initialUsers} />
      </Provider>
    );
  
    mockAxios.onGet('/search/users?q=test').reply(200, { items: [] });
  
    expect(screen.getByText('User')).toBeInTheDocument();
  
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });
  
    await waitFor(() => {
      expect(screen.queryByText('User')).not.toBeInTheDocument();
    });
  
    mockAxios.onGet('/search/users?q=').reply(200, { items: mockUserResponse });
  
    fireEvent.change(searchInput, { target: { value: '' } });
  
    await waitFor(() => {
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  test('should show and hide Loader component during search', async () => {
    render(
      <Provider store={store}>
        <Home initialUsers={initialUsers} />
      </Provider>
    );
  
    expect(screen.getByText('User')).toBeInTheDocument();
  
    mockAxios.onGet('/search/users?q=test').reply(() => {
      return new Promise((resolve) => setTimeout(() => resolve([200, { items: [] }]), 1000));
    });
  
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });
  
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  
    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    });
  
    expect(screen.queryByText('User')).not.toBeInTheDocument();
  });

  test('logs error details when search API fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockAxios.onGet('/search/users').reply(500);

    render(
      <Provider store={store}>
        <Home initialUsers={initialUsers} />
      </Provider>
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(screen.getByText('Falha ao pesquisar usuários. Por favor, tente novamente mais tarde.')).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test('handles user click and dispatches action', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(store, 'dispatch').mockImplementation(mockDispatch);

    render(
      <Provider store={store}>
        <Home initialUsers={initialUsers} />
      </Provider>
    );

    fireEvent.click(screen.getByText('User'));

    expect(mockDispatch).toHaveBeenCalledWith(addVisitedUser('user'));
  });
});
