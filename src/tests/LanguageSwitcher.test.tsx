import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { I18nProvider } from '@/contexts/I18nContext';

describe('LanguageSwitcher', () => {
  it('toggles dropdown and switches language affecting document attributes', async () => {
    render(<I18nProvider><LanguageSwitcher /></I18nProvider>);
    const button = screen.getByRole('button');
    // Open dropdown
    await userEvent.click(button);
    const arabicOption = screen.getByText('العربية');
    await userEvent.click(arabicOption);
    // html dir/lang updated by provider effect
    expect(document.documentElement.getAttribute('lang')).toBe('ar');
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
  });
});