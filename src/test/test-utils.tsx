import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Minimal i18n setup — returns the key as the translation value so tests
// are deterministic and don't depend on translation file content.
const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: {} } },
  interpolation: { escapeValue: false },
  // Return key when translation is missing
  missingKeyHandler: () => {},
  parseMissingKeyHandler: (key: string) => key,
});

interface WrapperProps {
  routerProps?: MemoryRouterProps;
}

function AllProviders({
  children,
  routerProps,
}: React.PropsWithChildren<WrapperProps>) {
  return (
    <I18nextProvider i18n={testI18n}>
      <MemoryRouter {...routerProps}>{children}</MemoryRouter>
    </I18nextProvider>
  );
}

function customRender(
  ui: React.ReactElement,
  {
    routerProps,
    ...renderOptions
  }: RenderOptions & WrapperProps = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders routerProps={routerProps}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}

export { customRender as render };
export * from '@testing-library/react';
