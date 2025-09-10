const arr = [
  { option: "A", count: 34, userSelected: true },
  { option: "B", count: 0, userSelected: false },
];

const total = arr.reduce((sum, item) => sum + item.count, 0);

const arrWithPercent = arr.map((item) => {
  const rawPercent = total > 0 ? (item.count / total) * 100 : 0;
  const percent = Number.isInteger(rawPercent)
    ? rawPercent
    : Number(rawPercent.toFixed(2));

  return {
    ...item,
    percent,
  };
});

export const dataForTest = [
  ...arrWithPercent.filter((d) => !d.userSelected),
  ...arrWithPercent.filter((d) => d.userSelected),
];
