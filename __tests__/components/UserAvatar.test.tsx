import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import UserAvatar from '@/components/UserAvatar';

describe('UserAvatar Component', () => {
  test('renders image with correct src and alt attributes', () => {
    const testSrc = 'https://example.com/avatar.jpg';
    const testAlt = 'User Avatar';

    render(<UserAvatar src={testSrc} alt={testAlt} />);

    const imgElement = screen.getByAltText(testAlt);
    expect(imgElement).toBeInTheDocument();

    expect(imgElement).toHaveAttribute('src', testSrc);

    expect(imgElement).toHaveAttribute('alt', testAlt);
  });

  test('applies additional className correctly', () => {
    const testSrc = 'https://example.com/avatar.jpg';
    const testAlt = 'User Avatar';
    const additionalClass = 'border-4 border-gray-500';

    render(<UserAvatar src={testSrc} alt={testAlt} className={additionalClass} />);

    const imgElement = screen.getByAltText(testAlt);
    expect(imgElement).toHaveClass(`rounded-full ${additionalClass}`);
  });
});
