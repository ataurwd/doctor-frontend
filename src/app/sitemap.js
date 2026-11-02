import { getBootstrapData } from '@/lib/api';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const locales = ['en', 'bn'];
  const staticPaths = [
    '',
    '/about',
    '/specialities',
    '/services',
    '/chambers',
    '/appointment',
    '/patient-education',
    '/downloads',
    '/contact',
  ];

  const entries = [];
  for (const loc of locales) {
    for (const p of staticPaths) {
      entries.push({
        url: `${baseUrl}/${loc}${p}`,
        lastModified: new Date(),
      });
    }
  }

  try {
    const data = await getBootstrapData();
    if (data?.specialities) {
      for (const loc of locales) {
        for (const s of data.specialities) {
          entries.push({
            url: `${baseUrl}/${loc}/specialities/${s.slug}`,
            lastModified: new Date(),
          });
        }
      }
    }
    if (data?.specialServices) {
      for (const loc of locales) {
        for (const s of data.specialServices) {
          entries.push({
            url: `${baseUrl}/${loc}/services/${s.slug}`,
            lastModified: new Date(),
          });
        }
      }
    }
  } catch (e) {
    // Ignore if backend is offline during static generation
  }

  return entries;
}

