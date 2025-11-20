import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountSection from '@/components/account/AccountSection';

describe('AccountSection', () => {
  it('renders title, description and children', () => {
    render(
      <AccountSection title="Profile" description="Basic profile info">
        <div>Child Content</div>
      </AccountSection>
    );
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Basic profile info')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('renders without description', () => {
    render(
      <AccountSection title="Only Title">
        <span>Child</span>
      </AccountSection>
    );
    expect(screen.getByText('Only Title')).toBeInTheDocument();
    expect(screen.queryByText('Basic profile info')).not.toBeInTheDocument();
  });
});
