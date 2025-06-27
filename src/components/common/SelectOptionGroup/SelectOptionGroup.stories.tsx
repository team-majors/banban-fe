import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SelectOptionGroup } from './SelectOptionGroup';

const meta: Meta<typeof SelectOptionGroup> = {
  title: 'components/common/SelectOptionGroup',
  component: SelectOptionGroup,
  tags: ["autodocs"],
  argTypes: {
    width: {
      description: "버튼의 너비"
    },
    rowGap: {
      description: "버튼 사이의 간격"
    },
    firstOptionString: {
      description: "첫번째 버튼 내부 문장"
    },
    secondOptionString: {
      description: "두번째 버튼 내부 문장"
    },
    onChange: {
      description: "외부에서 상태를 관찰하기 위한 callback 함수"
    }
  }
};

export default meta;
type Story = StoryObj<typeof SelectOptionGroup>;

export const Default: Story = {
  args: {
    width: "600px",
    rowGap: "10px",
    firstOptionString: "24시간 자유, 월 300씩 들어오는 백수",
    secondOptionString: "주 52시간 근무, 월급 600 직장인",
    onChange: (internalState) => {
      console.log(internalState);
      return internalState;
    }
  }
};