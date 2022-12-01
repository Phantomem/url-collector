import { divideDateRangeToPeriods } from '../../../src/lib/date';

describe('Date', () => {
  describe('divideDateRangeToPeriods', () => {
    const dataSet = [
      {
        input: [
          '2019-01-01',
          '2019-12-31',
          5,
          90
        ],
        output: [
          [ '2019-01-01', '2019-03-31' ],
          [ '2019-04-01', '2019-06-29' ],
          [ '2019-06-30', '2019-09-27' ],
          [ '2019-09-28', '2019-12-26' ],
          [ '2019-12-27', '2019-12-31' ]
        ],
      },
      {
        input: [
          '2019-01-01',
          '2021-01-01',
          5,
          150
        ],
        output: [
          [ '2019-01-01', '2019-05-30' ],
          [ '2019-05-31', '2019-10-27' ],
          [ '2019-10-28', '2020-03-25' ],
          [ '2020-03-26', '2020-08-22' ],
          [ '2020-08-23', '2021-01-01' ]
        ],
      },
      // TODO add date sets 
    ];
    it.each(dataSet)('should return valid output for given input', ({ input, output }) => {
      const [startDate, endDate, numOfPeriods, divide] = input;
      expect(divideDateRangeToPeriods(
        startDate as string,
        endDate as string,
        numOfPeriods as number, 
        divide as number,
      )).toEqual(output);
    });
  });
});
