import { screen } from '@testing-library/react';
import React from 'react';
import render from '@/utils/test/render';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { FloatingButton } from './FloatingButton';

function Wrapper() {
  const [state, setState] = React.useState<'add' | 'close'>('add');
  return (
    <FloatingButton
      state={state}
      onToggle={() => setState((prev) => (prev === 'add' ? 'close' : 'add'))}
    />
  );
}

it('버튼이 지정된 크기와 스타일로 렌더링된다', () => {
  render(<FloatingButton state="add" onToggle={() => {}} />);
  const button = screen.getByRole('button');

  expect(button).toHaveStyle({
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(to right, #6142FF 0%, #3F13FF 100%)',
  });
});

it('초기에는 AddIcon이 보이고, 클릭하면 CloseIcon으로 전환된다', async () => {
  await render(<Wrapper />);
  const addIcon = await screen.findByLabelText('open modal');
  expect(addIcon).toBeVisible();

  const button = screen.getByRole('button');
  await userEvent.click(button);

  const closeIcon = await screen.findByLabelText('close modal');
  expect(closeIcon).toBeVisible();
});