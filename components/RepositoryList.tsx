import React from 'react';
import RepositoryItem from './RepositoryItems';

interface RepositoryListProps {
  repos: {
    id: number;
    name: string;
    html_url: string;
  }[];
}

const RepositoryList = ({ repos }: RepositoryListProps) => {
  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-4 text-center">Repositórios</h3>
      <ul className="list-disc pl-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-lg mx-auto">
        {repos.map((repo) => (
          <RepositoryItem key={repo.id} repo={repo} />
        ))}
      </ul>
    </div>
  );
};

export default RepositoryList;
