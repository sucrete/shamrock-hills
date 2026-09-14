import TinyMCEInput from '../components/TinyMCEInput';

export default {
  title: 'SHGA Home',
  name: 'golfAssociation',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'SHGA Home' };
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
