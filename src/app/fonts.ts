import localFont from 'next/font/local';

// Registered at every weight/style the file set has, even though only Medium
// is in use on headings right now — so switching a heading to a different
// weight later is a font-weight change, not a new font-face to wire up.
export const revans = localFont({
  src: [
    { path: '../../public/fonts/Revans-Normal.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Revans-Italic.otf', weight: '400', style: 'italic' },
    { path: '../../public/fonts/Revans-Medium.otf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Revans-Medium-Italic.otf', weight: '500', style: 'italic' },
    { path: '../../public/fonts/Revans-SemiBold.otf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Revans-SemiBold-Italic.otf', weight: '600', style: 'italic' },
    { path: '../../public/fonts/Revans-Bold.otf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Revans-Bold-Italic.otf', weight: '700', style: 'italic' },
  ],
  variable: '--font-revans',
  display: 'swap',
});

export const engraversFont = localFont({
  src: '../../public/fonts/engravers.woff2',
  // You can define a CSS variable name here to use in Tailwind
  variable: '--font-engravers', 
  display: 'swap',
});

export const spaceMono = localFont({
  src: '../../public/fonts/spacemono.woff2',
  variable: '--font-space-mono', 
  display: 'swap',
})