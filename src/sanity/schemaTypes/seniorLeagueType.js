import TinyMCEInput from '../components/TinyMCEInput';

export default {
  title: 'Senior League',
  name: 'seniorLeague',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'Senior League' };
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
