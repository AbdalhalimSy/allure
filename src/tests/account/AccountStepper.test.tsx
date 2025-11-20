import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountStepper, { StepConfig } from '@/components/account/AccountStepper';

jest.mock('@/contexts/I18nContext', () => ({
  useI18n: () => ({ t: (k: string) => k, locale: 'en' })
}));

describe('AccountStepper', () => {
  const steps: StepConfig[] = [
    { id: 'basic', label: 'Basic', labelKey: 'step.basic', icon: 'A' },
    { id: 'details', label: 'Details', labelKey: 'step.details', icon: 'B' },
    { id: 'confirm', label: 'Confirm', labelKey: 'step.confirm', icon: 'C' }
  ];

  it('renders all steps', () => {
    render(
      <AccountStepper steps={steps} currentStep={0} onStepClick={() => {}} />
    );
    steps.forEach(s => {
      expect(screen.getByText(s.labelKey)).toBeInTheDocument();
    });
  });

  it('marks completed steps and allows clicking accessible steps only', async () => {
    const onStepClick = jest.fn();
    render(<AccountStepper steps={steps} currentStep={1} onStepClick={onStepClick} />);
    // Step 0 should be completed (shows check icon). We can assert icon presence by role or fallback to text replaced.
    // Completed step replaced icon with check; original icon 'A' should be absent.
    expect(screen.queryByText('A')).not.toBeInTheDocument();

    // Click step 0 (completed) -> allowed
    await userEvent.click(screen.getByText('step.basic'));
    // Click step 1 (current) -> allowed
    await userEvent.click(screen.getByText('step.details'));
    // Click step 2 (future) -> not allowed
    await userEvent.click(screen.getByText('step.confirm'));

    expect(onStepClick).toHaveBeenCalledTimes(2);
  });
});
