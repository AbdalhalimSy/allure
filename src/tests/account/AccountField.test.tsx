import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountField from '@/components/account/AccountField';

describe('AccountField', () => {
  it('renders label and required star', () => {
    render(
      <AccountField label="First Name" required>
        <input aria-label="first-name" />
      </AccountField>
    );
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders children and description', () => {
    render(
      <AccountField label="Bio" description="Tell us about yourself">
        <textarea aria-label="bio" />
      </AccountField>
    );
    expect(screen.getByLabelText('bio')).toBeInTheDocument();
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
  });
});
