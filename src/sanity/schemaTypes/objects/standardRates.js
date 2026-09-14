import { Standard } from '../../components/standard';
import rateValidation from '../../utils/rateValidation';

// Structure mirrors the "Greens Fees" table on shamrockhills.com/Rates:
// Type | Mon-Thurs | Fri-Sun, with 5 editable rows (18 Holes, 9 Holes,
// Junior, Senior, Twilight on the live site — typed in by hand in Studio).
export default {
  title: 'Greens Fees',
  name: 'standardRates',
  type: 'object',
  // Connect the custom component
  components: {
    input: Standard,
  },
  fields: [
    {
      name: 'standardRatesHeading',
      type: 'string',
      validation: (rule) => rule.required().max(35),
    },
    {
      name: 'standardRatesDescription',
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
      name: 'row1MonThurs',
      type: 'string',
      validation: rateValidation,
    },
    {
      name: 'row1FriSun',
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
      name: 'row2MonThurs',
      type: 'string',
      validation: rateValidation,
    },
    {
      name: 'row2FriSun',
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
      name: 'row3MonThurs',
      type: 'string',
      validation: rateValidation,
    },
    {
      name: 'row3FriSun',
      type: 'string',
      validation: rateValidation,
    },

    //* ROW 4
    {
      name: 'row4Title',
      type: 'string',
      validation: (rule) => rule.required().max(35),
    },
    {
      name: 'row4TitleDef',
      type: 'string',
      validation: (rule) => rule.max(35),
    },
    {
      name: 'row4MonThurs',
      type: 'string',
      validation: rateValidation,
    },
    {
      name: 'row4FriSun',
      type: 'string',
      validation: rateValidation,
    },

    //* ROW 5
    {
      name: 'row5Title',
      type: 'string',
      validation: (rule) => rule.required().max(35),
    },
    {
      name: 'row5TitleDef',
      type: 'string',
      validation: (rule) => rule.max(35),
    },
    {
      name: 'row5MonThurs',
      type: 'string',
      validation: rateValidation,
    },
    {
      name: 'row5FriSun',
      type: 'string',
      validation: rateValidation,
    },
  ],
};
