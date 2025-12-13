import React from 'react';
import { render, screen } from '@testing-library/react';
import JobFilterBar from '@/components/jobs/JobFilterBar';
import { I18nProvider } from '@/contexts/I18nContext';

const noop = () => {};

describe('JobFilterBar i18n', () => {
  it('renders English labels and placeholders', () => {
    localStorage.setItem('locale', 'en');
    render(
      <I18nProvider>
        <JobFilterBar value={{}} onChange={noop} />
      </I18nProvider>
    );

    expect(screen.getByPlaceholderText('Search jobs...')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('renders Arabic labels and placeholders', () => {
    localStorage.setItem('locale', 'ar');
    render(
      <I18nProvider>
        <JobFilterBar value={{}} onChange={noop} />
      </I18nProvider>
    );

    expect(screen.getByPlaceholderText('ابحث عن الوظائف...')).toBeInTheDocument();
    expect(screen.getByText('المرشحات')).toBeInTheDocument();
  });
});
