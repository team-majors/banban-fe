import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { FloatingInputModal } from './FloatingInputModal';

const meta = {
  title: 'Components/FloatingInputModal',
  component: FloatingInputModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '댓글 또는 피드를 작성할 때 표시되는 플로팅 입력 모달입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    actionType: {
      control: { type: 'select' },
      options: ['댓글', '피드'],
      description: '등록할 콘텐츠 타입',
    },
  },
  args: {
    onClose: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof FloatingInputModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CommentModal: Story = {
  args: {
    actionType: '댓글',
  },
};

export const FeedModal: Story = {
  args: {
    actionType: '피드',
  },
};

export const DefaultModal: Story = {
  args: {
    // actionType 기본값은 '댓글'
  },
};
