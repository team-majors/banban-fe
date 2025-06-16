import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FloatingButton } from '@/components/button';

const meta: Meta<typeof FloatingButton> = {
  title: 'components/button/FloatingButton',
  component: FloatingButton,
  argTypes: {
    state: {
      control: { type: 'radio' },
      options: ['add', 'close'],
      description: 'Initial state of the button',
    },
  },
  args: {
    state: 'add',
  },
};

export default meta;
type Story = StoryObj<typeof FloatingButton>;

export const Interactive: Story = {
  render: (args) => {
    const [state, setState] = useState<typeof args.state>(args.state);
    return (
      <FloatingButton
        {...args}
        state={state}
        onToggle={() => setState((prev) => (prev === 'add' ? 'close' : 'add'))}
      />
    );
  },
};
