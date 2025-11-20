import React from 'react';
import { render, screen } from '@testing-library/react';
import TalentList from '@/components/cards/TalentList';

describe('TalentList', () => {
  it('renders talents list with header', () => {
    render(<TalentList />);
    expect(screen.getByText('Talents')).toBeInTheDocument();
  });

  it('displays placeholder talent cards', () => {
    render(<TalentList />);
    expect(screen.getByText('Talent 1')).toBeInTheDocument();
    expect(screen.getByText('Talent 2')).toBeInTheDocument();
    expect(screen.getByText('Talent 3')).toBeInTheDocument();
    expect(screen.getByText('Talent 4')).toBeInTheDocument();
  });

  it('shows profession labels', () => {
    render(<TalentList />);
    const modelLabels = screen.getAllByText('Model');
    expect(modelLabels).toHaveLength(4);
  });
});
