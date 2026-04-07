import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the updated hero heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/design a payment page that looks sharp/i);
  expect(headingElement).toBeInTheDocument();
});
