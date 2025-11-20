import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { I18nProvider, useI18n } from '@/contexts/I18nContext';

function Sample() {
  const { t, setLocale, locale } = useI18n();
  return (
    <div>
      <p data-testid="greeting">{t('nav.login')}</p>
      <p data-testid="locale">{locale}</p>
      <button data-testid="switch" onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>switch</button>
    </div>
  );
}

describe('I18nContext', () => {
  it('renders translation and switches locale', async () => {
    render(<I18nProvider><Sample /></I18nProvider>);
    const initial = screen.getByTestId('locale').textContent;
    expect(initial === 'en' || initial === 'ar').toBe(true);
    const btn = screen.getByTestId('switch');
    await userEvent.click(btn);
    await waitFor(() => expect(screen.getByTestId('locale').textContent).not.toBe(initial));
  });

  it('falls back to key when missing', () => {
    render(<I18nProvider><Fallback /></I18nProvider>);
    expect(screen.getByTestId('missing').textContent).toBe('missing.key');
  });
});

function Fallback() {
  const { t } = useI18n();
  return <span data-testid="missing">{t('missing.key')}</span>;
}
