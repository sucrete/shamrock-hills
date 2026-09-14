export default {
  title: 'Notices',
  name: 'ticker',
  type: 'document',
  preview: {
    prepare() {
      return {
        title: 'Notices',
      };
    },
  },
  fields: [
    { 
      name: 'tickerQuestion',
      title: 'Display Notices?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'tickerArray',
      title: 'Notices Content',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ document }) => !document?.tickerQuestion,
    },
  ],
};
