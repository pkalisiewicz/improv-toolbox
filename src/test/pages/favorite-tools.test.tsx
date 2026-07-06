import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../test-utils';
import { MorePage } from '../../pages/MorePage';
import { SplashPage } from '../../pages/SplashPage';
import {
  FAVORITE_TOOLS_STORAGE_KEY,
} from '../../theme/favoriteTools';

function renderedAllToolNames() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-tool-card-zone="all"] [data-tool-name]'))
    .map((el) => el.dataset.toolName);
}

describe('favorite tools', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-favorite-tools');
    document.documentElement.removeAttribute('data-has-favorite-tools');
  });

  it('shows favorites separately on the More page without reordering all tools', async () => {
    const user = userEvent.setup();
    render(<MorePage />);

    expect(renderedAllToolNames()[0]).toBe('timer');

    await user.click(screen.getByTestId('favorite-status'));

    expect(renderedAllToolNames()[0]).toBe('timer');
    expect(JSON.parse(window.localStorage.getItem(FAVORITE_TOOLS_STORAGE_KEY) ?? '[]')).toEqual(['status']);
    expect(document.documentElement).toHaveAttribute('data-favorite-tools', 'status');
  });

  it('renders favorite controls on launcher tiles without reordering all tools', async () => {
    const user = userEvent.setup();
    render(<SplashPage />);

    expect(screen.getByTestId('favorite-wheel')).toBeInTheDocument();
    expect(screen.getByTestId('favorite-scene')).toBeInTheDocument();

    await user.click(screen.getByTestId('favorite-status'));

    expect(renderedAllToolNames()[0]).toBe('wheel');
    expect(document.documentElement).toHaveAttribute('data-favorite-tools', 'status');
  });

  it('bootstraps persisted launcher favorites without a loading or layout animation state', async () => {
    window.localStorage.setItem(FAVORITE_TOOLS_STORAGE_KEY, JSON.stringify(['scene']));

    render(<SplashPage />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-favorite-tools', 'scene');
    });

    const favoriteControl = screen.getByTestId('favorite-scene-all-tools');
    expect(favoriteControl.querySelector('span')).not.toHaveClass('animate-favorite-pop');
    expect(renderedAllToolNames()[0]).toBe('wheel');
  });
});
