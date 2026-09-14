// Dedicated PostCSS config for compiling src/styles/editor.entry.css -> public/editor.css
// (the TinyMCE iframe's stylesheet). Kept separate from postcss.config.mjs — which Next.js's
// own build pipeline consumes directly and handles the plugin export shape differently — so
// this one can use the object-map plugin form that postcss-cli needs to invoke
// @tailwindcss/postcss correctly when run standalone via the CLI.
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
