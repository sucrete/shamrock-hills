export default {
  title: 'Greens Fees',
  name: 'rates',
  type: 'document',
  groups: [
    { name: 'standardRates', title: 'Greens Fees' },
    { name: 'miscRates', title: 'Cart Fees' },
  ],
  preview: {
    prepare() {
      return {
        title: 'Greens Fees',
      };
    },
  },
  fields: [
    {
      title: 'Greens Fees',
      name: 'standard',
      type: 'standardRates',
      group: 'standardRates',
    },
    {
      title: 'Cart Fees',
      name: 'misc',
      type: 'miscRates',
      group: 'miscRates',
    },
  ],
};
