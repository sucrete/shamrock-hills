import TinyMCEInput from '../components/TinyMCEInput';

export default {
  title: 'Ladies League',
  name: 'ladiesLeague',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'Ladies League' };
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
