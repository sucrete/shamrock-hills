import TinyMCEInput from '../components/TinyMCEInput';

export default {
  title: 'Tournaments',
  name: 'tournaments',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'Tournaments' };
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
