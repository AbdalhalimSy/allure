import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountLayout from '@/components/account/AccountLayout';

jest.mock('next/navigation', () => ({
  usePathname: () => '/account/details'
}));

jest.mock('@/contexts/I18nContext', () => ({
  useI18n: () => ({ t: (k: string) => {
    const map: Record<string,string> = {
      'account.title': 'Account',
      'account.subtitle': 'Manage your account',
      'account.status.approvedTitle': 'Approved',
      'nav.basic': 'Basic Info',
      'nav.details': 'Details',
      'nav.confirm': 'Confirm'
    }; return map[k] || k; }, locale: 'en' })
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { profile: { approval_status: 'approved' } }
  })
}));

describe('AccountLayout', () => {
  const navItems = [
    { id: 'basic', label: 'Basic', labelKey: 'nav.basic', icon: 'B', completion: 40 },
    { id: 'details', label: 'Details', labelKey: 'nav.details', icon: 'D', completion: 100 },
    { id: 'confirm', label: 'Confirm', labelKey: 'nav.confirm', icon: 'C' }
  ];

  it('renders title, subtitle, status badge and children', () => {
    render(<AccountLayout navItems={navItems}><div>Inner Content</div></AccountLayout>);
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Manage your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/Approval status: approved/i)).toBeInTheDocument();
    expect(screen.getByText('Inner Content')).toBeInTheDocument();
  });

  it('renders completion percentage and check icon for completed', () => {
    render(<AccountLayout navItems={navItems}><span/></AccountLayout>);
    expect(screen.getByText('40%')).toBeInTheDocument(); // percentage badge
    // check icon replaced text, ensure 100% item has no plain percentage badge
    expect(screen.queryByText('100%')).not.toBeInTheDocument();
  });
});
