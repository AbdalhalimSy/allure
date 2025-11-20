import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('calls confirm and cancel handlers', async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        open
        title="Delete?"
        description="Are you sure?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    await userEvent.click(screen.getByText('No'));
    expect(onCancel).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByText('Yes'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});