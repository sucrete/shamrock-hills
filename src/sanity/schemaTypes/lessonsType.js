import TinyMCEInput from '../components/TinyMCEInput';

export default {
  title: 'Lessons',
  name: 'lessons',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'Lessons' };
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
