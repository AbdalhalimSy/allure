import React from 'react';
import { render, screen } from '@testing-library/react';
import TalentSpotlightCard from '@/components/cards/TalentSpotlightCard';

describe('TalentSpotlightCard', () => {
  const mockProps = {
    name: 'Sarah Johnson',
    category: 'Fashion Model',
    location: 'Dubai, UAE',
    availability: 'Available Now',
    tags: ['Editorial', 'Commercial', 'Runway'],
    coverGradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
  };

  it('renders talent name and category', () => {
    render(<TalentSpotlightCard {...mockProps} />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Fashion Model')).toBeInTheDocument();
  });

  it('displays location and availability', () => {
    render(<TalentSpotlightCard {...mockProps} />);
    expect(screen.getByText('Dubai, UAE')).toBeInTheDocument();
    expect(screen.getByText('Available Now')).toBeInTheDocument();
  });

  it('shows spotlight label', () => {
    render(<TalentSpotlightCard {...mockProps} />);
    expect(screen.getByText('Spotlight')).toBeInTheDocument();
  });

  it('renders all tags', () => {
    render(<TalentSpotlightCard {...mockProps} />);
    expect(screen.getByText('Editorial')).toBeInTheDocument();
    expect(screen.getByText('Commercial')).toBeInTheDocument();
    expect(screen.getByText('Runway')).toBeInTheDocument();
  });

  it('displays ready status', () => {
    render(<TalentSpotlightCard {...mockProps} />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });
});
