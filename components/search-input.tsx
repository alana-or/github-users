import axiosInstance from '@/lib/axiosInstance';
import React, { useState, ChangeEvent } from 'react';

interface SearchInputProps {
  onSearch: (users: User[]) => void;
}

interface User {
  login: string;
  name: string; 
  avatar_url: string; 
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearch(query);

    if (query) {
      try {
        const searchResult = await axiosInstance.get(`/search/users?q=${query}`);
        const usersData = searchResult.data.items;

        const userDetails = await Promise.all(
          usersData.map(async (user: User) => {
            const userRes = await axiosInstance.get(`/users/${user.login}`);
            return userRes.data;
          })
        );

        onSearch(userDetails);
      } catch (error) {
        console.error('Error fetching users:', error);
        onSearch([]);
      }
    } else {
      onSearch([]);
    }
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
