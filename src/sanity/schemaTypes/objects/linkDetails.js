export default {
  title: 'Link',
  name: 'linkDetails',
  type: 'object',
  fields: [
    {
      name: 'linkText',
      title: 'Link Button Text',
      type: 'string',
      validation: (rule) => [
        rule.max(21),
        rule.custom((value, context) => {
          if (context.document?.linkQuestion && !value) {
            return 'Link button text is required when a link is enabled.';
          }
          return true;
        }),
      ],
    },
    {
      name: 'linkURL',
      title: 'Link URL',
      type: 'url',
      validation: (rule) => [
        rule.uri({ scheme: ['http', 'https'] }).error("Invalid URL — make sure it starts with 'https://'"),
        rule.custom((value, context) => {
          if (context.document?.linkQuestion && !value) {
            return 'A URL is required when a link is enabled.';
          }
          return true;
        }),
      ],
    },
  ],
};
