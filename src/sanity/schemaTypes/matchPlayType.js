import TinyMCEInput from '../components/TinyMCEInput';

export default {
  title: 'Match Play',
  name: 'matchPlay',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'Match Play' };
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
