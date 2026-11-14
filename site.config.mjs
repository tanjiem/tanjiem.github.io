// The one place the site's address and the owner's details live.
//
// SITE_URL is the only host name in the code. It feeds canonical links,
// share images and the sitemap. To move to a custom domain, set the
// SITE_URL environment variable on the host (the fallback is localhost, for building on your own machine).
// Nothing else needs to change.

// Set it to the real address before deploying; localhost is only for building here.
export const SITE_URL = process.env.SITE_URL ?? 'http://localhost:4321';
if (!process.env.SITE_URL) console.warn('[seed notebook] SITE_URL is not set; links in share cards and the sitemap point at localhost.');

export const owner = {
  name: 'Tanjie McMeans',
  // Leave a value empty and the page shows a visible blank instead of a link.
  email: '',
  github: '',
  linkedin: '',
  resume: '/resume.pdf',
};
