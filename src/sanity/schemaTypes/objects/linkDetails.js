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
      // A plain string, not `url`, so editors can enter "www.example.com" — EVENTS_QUERY adds https://.
      type: 'string',
      description: "e.g. www.example.com — no need to type 'https://'",
      validation: (rule) =>
        rule.custom((value, context) => {
          // Browsers ignore ordinary trailing spaces in links, but not non-breaking ones, so only strip these.
          const url = value?.replace(/[ \t\r\n]+$/, '');
          if (!url) {
            return context.document?.linkQuestion ? 'A URL is required when a link is enabled.' : true;
          }
          // Zero-width and other invisible characters sneak in when pasting from email or Word.
          if (/[\u0000-\u001f\u007f-\u009f\u00ad\u200b-\u200f\u2028-\u202f\u2060-\u206f\ufeff]/.test(url)) {
            return 'This link contains a hidden character (often from copying out of an email or document). Delete it and type or paste it again.';
          }
          if (/^[^\s@\/]+@[^\s@\/]+\.[^\s\/]+$/.test(url)) {
            return 'That looks like an email address. Links need a web address, like www.example.com.';
          }
          return /^(https?:\/\/)?[^\s.\/]+\.[^\s]+$/i.test(url)
            ? true
            : 'That doesn’t look like a web address. Try something like www.example.com (no spaces).';
        }),
    },
  ],
};
