import React, { useState, ChangeEvent } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearch(query);
    onSearch(query);
  };

  return (
    <input
      type="text"
      value={search}
      onChange={handleSearch}
      placeholder="Buscar usuários..."
      className="p-3 border border-gray-300 rounded-lg mb-6 w-full max-w-lg"
    />
  );
};

export default SearchInput;
