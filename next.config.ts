import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The vendored TinyMCE build in public/tinymce/ is only ever loaded via a
  // <script src="/tinymce/..."> tag in the browser — no server code imports
  // it. Vercel's file-tracing step still parses every .js file it finds
  // (including public/) looking for require() calls, and its large files
  // (tinymce.js, silver/theme.js) trip Babel's "code generator deoptimised"
  // note in deploy logs. That note is harmless either way, but excluding
  // these from tracing avoids the wasted parse entirely.
  outputFileTracingExcludes: {
    '**/*': ['public/tinymce/**'],
  },
  turbopack: {
    resolveAlias: {
      '@': './src',
      '@public': './public',
    },
  },
  images: {
    qualities: [100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;
