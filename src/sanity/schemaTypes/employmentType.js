import TinyMCEInput from '../components/TinyMCEInput';

export default {
  title: 'Employment & Volunteers',
  name: 'employment',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'Employment & Volunteers' };
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
