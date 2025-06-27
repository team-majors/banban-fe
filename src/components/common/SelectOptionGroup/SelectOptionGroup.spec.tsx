import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectOptionGroup } from './SelectOptionGroup';
import { describe, it, expect, vi } from 'vitest';

describe('SelectOptionGroup', () => {
  const FIRST = '첫번째 옵션';
  const SECOND = '두번째 옵션';

  it('옵션이 클릭 될 때 값이 밖으로 전달되는가?', async () => {
    const onChange = vi.fn((state) => state);
    render(
      <SelectOptionGroup
        firstOptionString={FIRST}
        secondOptionString={SECOND}
        onChange={onChange}
        width="200px"
        height="100px"
        rowGap="8px"
      />
    );

    // 마운트 시 none 전달
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith('none');

    // 버튼 렌더링 확인
    const firstBtn = screen.getByText(FIRST);
    const secondBtn = screen.getByText(SECOND);
    expect(firstBtn).toBeInTheDocument();
    expect(secondBtn).toBeInTheDocument();

    // 제대로 된 값으로 호출되는지 확인
    await userEvent.click(firstBtn);
    expect(onChange).toHaveBeenLastCalledWith('firstOption');

    // 제대로 된 값으로 호출되는지 확인
    await userEvent.click(secondBtn);
    expect(onChange).toHaveBeenLastCalledWith('secondOption');
  });
});
