import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import RepositoryList from '@/components/RepositoryList';

jest.mock('../../components/RepositoryItem', () => {
  return ({ repo }: any) => (
    <li key={repo.id}>
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
        {repo.name}
      </a>
    </li>
  );
});

describe('RepositoryList Component', () => {
  test('renders repository list and items correctly', () => {
    const testRepos = [
      { id: 1, name: 'Repo 1', html_url: 'https://github.com/repo1' },
      { id: 2, name: 'Repo 2', html_url: 'https://github.com/repo2' },
    ];

    render(<RepositoryList repos={testRepos} />);

    expect(screen.getByText('Repositórios')).toBeInTheDocument();

    testRepos.forEach(repo => {
      expect(screen.getByText(repo.name)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: repo.name })).toHaveAttribute('href', repo.html_url);
    });
  });
});
