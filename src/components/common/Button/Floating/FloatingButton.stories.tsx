import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FloatingButton } from '@/components/common/Button';

const meta: Meta<typeof FloatingButton> = {
  title: 'components/common/Button/FloatingButton',
  component: FloatingButton,
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: { type: 'radio' },
      options: ['add', 'close'],
      description: '버튼의 아이콘 상태',
    },
    onToggle: {
      description: '버튼의 아이콘 상태를 바꾸는 함수'
    }
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

    useEffect(() => {
      setState(args.state);
    }, [args.state]);
    
    return (
      <FloatingButton
        {...args}
        state={state}
        onToggle={() => setState((prev) => (prev === 'add' ? 'close' : 'add'))}
      />
    );
  },
};
