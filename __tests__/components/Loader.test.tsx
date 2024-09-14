import Loader from '@/components/Loader';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

test('should render Loader component', () => {
  render(<Loader />);

  expect(screen.getByText('Carregando...')).toBeInTheDocument();
});
