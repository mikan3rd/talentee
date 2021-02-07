export const toUnitString = (targetNum: number) => {
  const unitArray = ["万", "億", "兆"];
  const magnification = 10000;

  let unitNum = 10000;
  if (targetNum < unitNum) {
    return targetNum.toLocaleString();
  }

  let convertedString = "";
  for (const unit of unitArray) {
    if (unitNum * magnification < targetNum) {
      unitNum *= magnification;
      continue;
    }
    convertedString = `${(targetNum / unitNum).toFixed(1).replace(".0", "")}${unit}`;
    break;
  }

  if (!convertedString) {
    const lastArray = unitArray[unitArray.length - 1];
    convertedString = `${Math.round((targetNum / unitNum) * magnification).toLocaleString()}${lastArray}`;
  }

  return convertedString;
};

export const toRankingNumByPagination = ({ take, page, index }: { take: number; page: number; index: number }) => {
  return take * (page - 1) + index + 1;
};
