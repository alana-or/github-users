import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import ErrorMessage from '@/components/ErrorMessage';

describe('ErrorMessage Component', () => {
  test('renders the error message correctly', () => {
    const testMessage = 'Tente novamente mais tarde.';

    render(<ErrorMessage message={testMessage} />);

    expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    expect(screen.getByText(testMessage)).toBeInTheDocument();

    const alertDiv = screen.getByRole('alert');
    expect(alertDiv).toHaveClass('bg-red-100');
    expect(alertDiv).toHaveClass('border-red-400');
    expect(alertDiv).toHaveClass('text-red-700');
  });
});
