import { PunchCards } from "../../components/punchcards";
import rateValidation from "../../utils/rateValidation";

export default {
  title: 'Punch Card Rates',
  name: 'punchCardRates',
  type: 'object',
  // Connect the custom component
  components: {
    input: PunchCards,
  },
  fields: [
    {
      name: 'punchCardsHeading', 
      type: 'string',
      validation: (rule) => rule.required().max(35),
    },
    {
      name: 'punchCardsDescription',
      type: 'text',
      validation: (rule) => rule.max(300),
    },

    //* ROW 1 
      {
      name: 'regularTitle',
      type: 'string',
      validation: (rule) => rule.required().max(35),
    },
    {
      name: 'regularTitleDef',
      type: 'string',
      validation: (rule) => rule.max(35),
    },
    {
      name: 'regular9',
      type: 'string',
      validation: rateValidation,
    },
    {
      name: 'regular18',
      type: 'string',
      validation: rateValidation,
    },

    //* ROW 2
      {
      name: 'seniorTitle',
      type: 'string',
      validation: (rule) => rule.required().max(35),
    },
    {
      name: 'seniorTitleDef',
      type: 'string',
      validation: (rule) => rule.max(35),
    },
    {
      name: 'senior9',
      type: 'string',
      validation: rateValidation,
    },
    {
      name: 'senior18',
      type: 'string',
      validation: rateValidation,
    },
  ],
};
