import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Etc/UTC');

export const differenceInDays = (startDate: string, endDate: string): number => {
  return dayjs(endDate).diff(startDate, 'days');
};

export const divideDateRangeToPeriods = (
  startDate: string,
  endDate: string,
  numOfPeriods: number,
): string[][] => {
  const periodDays = differenceInDays(startDate, endDate) / numOfPeriods;
  return Array.from<string[][]>({ length: numOfPeriods }).reduce<string[][]>((accumulator, _, i: number) => {
    const startPeriodDate = (i === 0 
      ? dayjs(startDate)
      : dayjs(accumulator[accumulator.length - 1][1]).add(1, 'days'));
    const endPeriodDate = i === numOfPeriods - 1 
      ? endDate 
      : startPeriodDate.add(periodDays - 1, 'days').format('YYYY-MM-DD');

    return [...accumulator, [startPeriodDate.format('YYYY-MM-DD'), endPeriodDate]]
  }, []);
};
