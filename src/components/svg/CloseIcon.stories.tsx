import type { Meta, StoryObj } from '@storybook/react-vite';
import { CloseIcon } from '@/components/svg';

const meta: Meta<typeof CloseIcon> = {
  title: 'components/icons/CloseIcon',
  component: CloseIcon,
  argTypes: {
    width: { control: { type: 'number', min: 8, max: 128 } },
    height: { control: { type: 'number', min: 8, max: 128 } },
  },
  args: {
    width: 32,
    height: 32,
    color: "#fff"
  },
};

export default meta;
type Story = StoryObj<typeof CloseIcon>;

export const Default: Story = {
  args: {
    color: "#000000",
  }
};
