import { getStaticProps } from 'next/dist/build/templates/pages';
import axiosInstance from '../lib/axiosInstance';

jest.mock('../lib/axiosInstance');

describe('getStaticProps', () => {
  it('fetches user data and repos successfully', async () => {
    (axiosInstance.get as jest.Mock).mockImplementation((url) => {
      if (url.includes('/users/user')) {
        return Promise.resolve({
          data: {
            login: 'user',
            avatar_url: 'https://example.com/avatar.jpg',
            name: 'User',
          },
        });
      }
      if (url.includes('/users/user/repos')) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              name: 'Repo1',
              html_url: 'https://example.com/repo1',
            },
            {
              id: 2,
              name: 'Repo2',
              html_url: 'https://example.com/repo2',
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });

    const context = { params: { username: 'user' } };
    const result = await getStaticProps(context as any);

    expect(result).toEqual({
      props: {
        user: {
          login: 'user',
          avatar_url: 'https://example.com/avatar.jpg',
          name: 'User',
        },
        repos: [
          {
            id: 1,
            name: 'Repo1',
            html_url: 'https://example.com/repo1',
          },
          {
            id: 2,
            name: 'Repo2',
            html_url: 'https://example.com/repo2',
          },
        ],
      },
      revalidate: 3600,
    });
  });

  it('returns empty user and repos on error', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    const context = { params: { username: 'user' } };
    const result = await getStaticProps(context as any);

    expect(result).toEqual({
      props: {
        user: null,
        repos: [],
      },
      revalidate: 3600,
    });
  });
});
