import { Miscellaneous } from '../../components/miscellaneous';
import rateValidation from '../../utils/rateValidation';

// Structure mirrors the "Cart Fees" table on shamrockhills.com/Rates:
// Type | Price, with 3 editable rows (18 Holes, 9 Holes, Twilight on the
// live site — typed in by hand in Studio).
export default {
  title: 'Cart Fees',
  name: 'miscRates',
  type: 'object',
  // Connect the custom component
  components: {
    input: Miscellaneous,
  },
  fields: [
    {
      name: 'miscHeading',
      type: 'string',
      validation: (rule) => rule.required().max(35),
    },
    {
      name: 'miscDescription',
      type: 'text',
      validation: (rule) => rule.max(300),
    },

    //* ROW 1
    {
      name: 'row1Title',
      type: 'string',
      validation: (rule) => rule.required().max(35),
    },
    {
      name: 'row1TitleDef',
      type: 'string',
      validation: (rule) => rule.max(35),
    },
    {
      name: 'row1Price',
      type: 'string',
      validation: rateValidation,
    },

    //* ROW 2
    {
      name: 'row2Title',
      type: 'string',
      validation: (rule) => rule.required().max(35),
    },
    {
      name: 'row2TitleDef',
      type: 'string',
      validation: (rule) => rule.max(35),
    },
    {
      name: 'row2Price',
      type: 'string',
      validation: rateValidation,
    },

    //* ROW 3
    {
      name: 'row3Title',
      type: 'string',
      validation: (rule) => rule.required().max(35),
    },
    {
      name: 'row3TitleDef',
      type: 'string',
      validation: (rule) => rule.max(35),
    },
    {
      name: 'row3Price',
      type: 'string',
      validation: rateValidation,
    },
  ],
};
