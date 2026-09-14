import moment from 'moment';

export default {
  title: 'Event',
  name: 'events',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      subtitle: 'start',
      media: 'flyer',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title,
        subtitle: `${moment(subtitle).format('dddd, MMMM Do, YYYY')}`,
        media: media,
      };
    },
  },
  fields: [
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (rule) => rule.required().max(70),
    },
    {
      name: 'start',
      title: 'Event Date',
      type: 'date',
      validation: (rule) => rule.required(),
      options: {
        dateFormat: 'dddd, MMMM Do, YYYY',
      },
    },
    {
      name: 'multidayEvent',
      title: 'Multi-day event?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'end',
      title: 'Event End Date',
      type: 'date',
      validation: (rule) =>
        rule.custom((value, context) => (context.document?.multidayEvent && value === undefined ? 'Required.' : true)),
      hidden: ({ document }) => !document?.multidayEvent,
      options: {
        dateFormat: 'dddd, MMMM Do, YYYY',
      },
    },
    {
      name: 'eventDescription',
      type: 'text',
      rows: 5,
    },
    {
      name: 'flyerQuestion',
      title: 'Flyer?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'flyer',
      type: 'image',
      description: 'Keep height of flyer under 1500px',
      validation: (rule) =>
        rule.custom((value, context) => {
          const shouldShowImage = context.document?.flyerQuestion;
          if (shouldShowImage && !value) {
            return 'Uploading an image is required.';
          }
          return true;
        }),
      hidden: ({ document }) => !document?.flyerQuestion,
    },
    {
      name: 'linkQuestion',
      title: 'Link?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'linkDeets',
      title: 'Link Details',
      type: 'linkDetails',
      validation: (rule) =>
        rule.custom((value, context) => {
          const shouldGiveDeets = context.document?.linkQuestion;
          if (shouldGiveDeets && !value) {
            return 'Link button requires text and url.';
          }
          return true;
        }),
      hidden: ({ document }) => !document?.linkQuestion,
    },
  ],
  orderings: [
    {
      title: 'Date, New → Old',
      name: 'eventDateAsc',
      by: [{ field: 'start', direction: 'desc' }],
    },
    {
      title: 'Date, Old → New',
      name: 'eventDateDesc',
      by: [{ field: 'start', direction: 'asc' }],
    },
  ],
};
