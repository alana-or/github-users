import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import Heading from '@/components/Heading';

describe('Heading Component', () => {
  test('renders the heading text correctly', () => {
    const testText = 'This is a heading';

    render(<Heading text={testText} />);

    expect(screen.getByText(testText)).toBeInTheDocument();

    const headingElement = screen.getByRole('heading', { level: 1 });
    expect(headingElement).toHaveClass('text-3xl');
    expect(headingElement).toHaveClass('font-bold');
    expect(headingElement).toHaveClass('mb-6');
    expect(headingElement).toHaveClass('text-gray-800');
    expect(headingElement).toHaveClass('text-center');
    expect(headingElement).toHaveClass('w-full');
  });
});
