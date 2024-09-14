import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import SearchInput from '@/components/SearchInput';

describe('SearchInput Component', () => {
  test('renders input field correctly', () => {
    render(<SearchInput onSearch={() => {}} />);

    const inputElement = screen.getByPlaceholderText('Buscar usuários...');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
  });

  test('updates value and calls onSearch on input change', () => {
    const mockOnSearch = jest.fn();
    render(<SearchInput onSearch={mockOnSearch} />);

    const inputElement = screen.getByPlaceholderText('Buscar usuários...');
    
    fireEvent.change(inputElement, { target: { value: 'John' } });

    expect(inputElement).toHaveValue('John');

    expect(mockOnSearch).toHaveBeenCalledWith('John');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
});
