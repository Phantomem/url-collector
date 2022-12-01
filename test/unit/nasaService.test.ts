import { calculateRequestConcurency } from '../../src/nasa/nasaService';

describe('Nasa Service', () => {
  describe('calculateRequestConcurency', () => {
    const dataSet = [
      {
        input: [
          '2019-01-01',
          '2019-01-01'
        ],
        output: 1
      },
      {
        input: [
          '2019-01-01',
          '2020-01-01'
        ],
        output: 1
      },
      {
        input: [
          '2017-01-01',
          '2019-01-01'
        ],
        output: 2
      },
      {
        input: [
          '2015-01-01',
          '2020-01-01'
        ],
        output: 4
      },
    ];
    it.each(dataSet)('should return valid concurency', ({ input, output }) => {
      const [startDate, endDate] = input;
      expect(calculateRequestConcurency(startDate, endDate)).toBe(output);
    });
  });
});
