import React from 'react';
import { render, screen } from '@testing-library/react';
import TalentProfile from '@/components/cards/TalentProfile';

describe('TalentProfile', () => {
  it('renders talent profile placeholder', () => {
    render(<TalentProfile />);
    expect(screen.getByText('Talent Name')).toBeInTheDocument();
    expect(screen.getByText('Model')).toBeInTheDocument();
    expect(screen.getByText(/Biography and details go here/)).toBeInTheDocument();
  });

  it('displays apply button', () => {
    render(<TalentProfile />);
    expect(screen.getByRole('button', { name: /apply now/i })).toBeInTheDocument();
  });
});
