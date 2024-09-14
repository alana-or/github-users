import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import RepositoryItem from '@/components/RepositoryItems';

describe('RepositoryItem Component', () => {
  test('renders repository name and link correctly', () => {
    const testRepo = {
      id: 1,
      name: 'Test Repository',
      html_url: 'https://github.com/test/repo'
    };

    render(<RepositoryItem repo={testRepo} />);

    expect(screen.getByText(testRepo.name)).toBeInTheDocument();

    const linkElement = screen.getByRole('link', { name: testRepo.name });
    expect(linkElement).toHaveAttribute('href', testRepo.html_url);
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
