import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import { BottomNav } from '../../components/layout/BottomNav';

describe('BottomNav', () => {
  it('renders without crashing', () => {
    render(<BottomNav />);
    expect(document.querySelector('nav')).toBeInTheDocument();
  });

  it('renders all 5 tabs', () => {
    render(<BottomNav />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(5);
  });

  it('shows the navigation landmark', () => {
    render(<BottomNav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders a custom icon in each tab', () => {
    const { container } = render(<BottomNav />);
    // Each of the 5 tabs renders one custom SVG glyph (no emoji-as-UI).
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBe(5);
  });

  it('renders Main as the first tab', () => {
    render(<BottomNav />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAccessibleName('nav.main');
    expect(screen.queryByRole('button', { name: 'nav.more' })).not.toBeInTheDocument();
  });

  it('marks the Main tab active on the splash route', () => {
    render(<BottomNav />, { routerProps: { initialEntries: ['/'] } });
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].getAttribute('aria-current')).toBe('page');
  });

  it('marks the current tool route tab as active', () => {
    render(<BottomNav />, { routerProps: { initialEntries: ['/wheel'] } });
    // Main is first; Wheel is second and carries aria-current="page" on /wheel.
    const buttons = screen.getAllByRole('button');
    expect(buttons[1].getAttribute('aria-current')).toBe('page');
  });

  it('does not mark a primary tab active for More hub routes', () => {
    render(<BottomNav />, { routerProps: { initialEntries: ['/timer'] } });
    const buttons = screen.getAllByRole('button');
    expect(buttons.every((button) => button.getAttribute('aria-current') !== 'page')).toBe(true);
  });
});
