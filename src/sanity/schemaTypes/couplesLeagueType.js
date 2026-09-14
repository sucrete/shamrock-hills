import TinyMCEInput from '../components/TinyMCEInput';

export default {
  title: 'Couples League',
  name: 'couplesLeague',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'Couples League' };
    },
  },
  fields: [
    {
      name: 'body',
      title: 'Page Content',
      type: 'text',
      components: { input: TinyMCEInput },
    },
  ],
};
