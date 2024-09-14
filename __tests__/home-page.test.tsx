import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/pages/index'; 
import { Provider } from 'react-redux';
import store from '@/store/store'; 
import { addVisitedUser } from '@/store/historySlice';

jest.mock('../lib/axiosInstance', () => ({
  get: jest.fn(),
}));

const mockAxios = require('../lib/axiosInstance');

const initialUsers = [
  {
    login: 'user',
    avatar_url: 'https://avatars',
    name: 'User',
  },
];

describe('Home Page', () => {
  beforeEach(() => {
    mockAxios.get.mockReset();
  });

  it('renders Home', () => {
    render(
      <Provider store={store}>
        <Home initialUsers={initialUsers} />
      </Provider>
    );
    expect(screen.getByText('GitHub Usuários')).toBeInTheDocument();
  });

  it('fetches and displays filtered users', async () => {
    mockAxios.get.mockImplementation((url: string | string[]) => {
      if (url.includes('/search/users')) {
        return Promise.resolve({
          data: {
            items: [{ login: 'newuser' }],
          },
        });
      }
      if (url.includes('/users/newuser')) {
        return Promise.resolve({
          data: {
            login: 'newuser',
            avatar_url: 'https://avatars',
            name: 'New User',
          },
        });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <Provider store={store}>
        <Home initialUsers={initialUsers} />
      </Provider>
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'newuser' } });

    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument();
    });
  });

  it('handles user click', () => {
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
