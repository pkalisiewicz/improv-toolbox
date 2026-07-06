import { describe, expect, it } from 'vitest';
import { screen } from '../test-utils';
import { render } from '../test-utils';
import { AppErrorPage } from '../../pages/ErrorPage';

describe('AppErrorPage', () => {
  it('renders a useful not-found page', () => {
    render(<AppErrorPage variant="not-found" statusCode={404} />);

    expect(screen.getByRole('heading', { name: 'OHO, you got lost!' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('navigation', { name: 'Or pick a tool' })).toBeInTheDocument();
  });

  it('offers a retry action for runtime errors', () => {
    render(<AppErrorPage variant="crash" statusCode={500} />);

    expect(screen.getByRole('heading', { name: 'OHO, something broke!' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
  });
});
