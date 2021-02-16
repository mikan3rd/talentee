import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class UtilsService {
  private readonly logger = new Logger(UtilsService.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chunk<T extends any>(arr: T[], len: number) {
    const chunks = [];
    let i = 0;
    const n = arr.length;

    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }

    return chunks;
  }

  groupByObject = <K, V>(array: readonly V[], getKey: (cur: V, idx: number, src: readonly V[]) => K): [K, V[]][] =>
    Array.from(
      array.reduce((map, cur, idx, src) => {
        const key = getKey(cur, idx, src);
        const list = map.get(key);
        if (list) list.push(cur);
        else map.set(key, [cur]);
        return map;
      }, new Map<K, V[]>()),
    );

  toUnitString(targetNum: number) {
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
  }

  async asyncFilter<T>(array: T[], asyncCallback: (args: T) => Promise<boolean>) {
    const bits = await Promise.all(array.map(asyncCallback));
    return array.filter((_, i) => bits[i]);
  }
}
