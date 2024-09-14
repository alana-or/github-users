import Link from 'next/link';

interface RepositoryItemProps {
  repo: {
    id: number;
    name: string;
    html_url: string;
  };
}

const RepositoryItem = ({ repo }: RepositoryItemProps) => {
  return (
    <li key={repo.id} className="mb-2">
      <Link href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        {repo.name}
      </Link>
    </li>
  );
};

export default RepositoryItem;
