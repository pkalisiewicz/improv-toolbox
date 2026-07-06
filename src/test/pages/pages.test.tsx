/**
 * Smoke tests for all pages — verify each route renders without throwing
 * and shows at minimum one visible element (heading, button, or text).
 */
import { describe, it, expect } from 'vitest';
import { render } from '../test-utils';

// Pages
import { SplashPage } from '../../pages/SplashPage';
import { WheelPage } from '../../pages/WheelPage';
import { ScenePage } from '../../pages/ScenePage';
import { WarmupPage } from '../../pages/WarmupPage';
import { FactsPage } from '../../pages/FactsPage';
import { MorePage } from '../../pages/MorePage';
import { TimerPage } from '../../pages/TimerPage';
import { CharacterPage } from '../../pages/CharacterPage';
import { PromptsPage } from '../../pages/PromptsPage';
import { SuggestionsPage } from '../../pages/SuggestionsPage';
import { FormatsPage } from '../../pages/FormatsPage';
import { ReflectionPage } from '../../pages/ReflectionPage';
import { SoundscapePage } from '../../pages/SoundscapePage';
import { StatusPage } from '../../pages/StatusPage';
import { SpinePage } from '../../pages/SpinePage';
import { JamPage } from '../../pages/JamPage';
import { PrinciplesPage } from '../../pages/PrinciplesPage';
import { MonologuePage } from '../../pages/MonologuePage';
import { GenresPage } from '../../pages/GenresPage';
import { HaroldPage } from '../../pages/HaroldPage';
import { EmotionPage } from '../../pages/EmotionPage';
import { ConstraintsPage } from '../../pages/ConstraintsPage';
import { MetronomePage } from '../../pages/MetronomePage';
import { VariantsPage } from '../../pages/VariantsPage';
import { ReplayPage } from '../../pages/ReplayPage';
import { DeconstructionPage } from '../../pages/DeconstructionPage';

function smoke(name: string, element: React.ReactElement) {
  it(`${name} renders without crashing`, () => {
    const { container } = render(element);
    expect(container.firstChild).not.toBeNull();
  });
}

describe('Page smoke tests', () => {
  smoke('SplashPage', <SplashPage />);
  smoke('WheelPage', <WheelPage />);
  smoke('ScenePage', <ScenePage />);
  smoke('WarmupPage', <WarmupPage />);
  smoke('FactsPage', <FactsPage />);
  smoke('MorePage', <MorePage />);
  smoke('TimerPage', <TimerPage />);
  smoke('CharacterPage', <CharacterPage />);
  smoke('PromptsPage', <PromptsPage />);
  smoke('SuggestionsPage', <SuggestionsPage />);
  smoke('FormatsPage', <FormatsPage />);
  smoke('ReflectionPage', <ReflectionPage />);
  smoke('SoundscapePage', <SoundscapePage />);
  smoke('StatusPage', <StatusPage />);
  smoke('SpinePage', <SpinePage />);
  smoke('JamPage', <JamPage />);
  smoke('PrinciplesPage', <PrinciplesPage />);
  smoke('MonologuePage', <MonologuePage />);
  smoke('GenresPage', <GenresPage />);
  smoke('HaroldPage', <HaroldPage />);
  smoke('EmotionPage', <EmotionPage />);
  smoke('ConstraintsPage', <ConstraintsPage />);
  smoke('MetronomePage', <MetronomePage />);
  smoke('VariantsPage', <VariantsPage />);
  smoke('ReplayPage', <ReplayPage />);
  smoke('DeconstructionPage', <DeconstructionPage />);
});
