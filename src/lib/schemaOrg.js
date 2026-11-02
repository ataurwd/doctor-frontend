import { tr } from '@/i18n/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function buildPhysicianSchema(doctor, chambers = [], settings = {}, locale = 'en') {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: tr(doctor, 'name', locale) || 'Dr. Md. Kamrul Hasan Sajib',
    url: `${SITE_URL}/${locale}`,
    medicalSpecialty: 'https://schema.org/Rheumatologic',
    description: tr(doctor, 'specialty_line', locale),
    hospitalAffiliation: {
      '@type': 'Hospital',
      name: 'Dhaka Medical College Hospital',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dhaka',
        addressCountry: 'BD',
      },
    },
    location: chambers.map((c) => {
      const clinic = {
        '@type': 'MedicalClinic',
        name: tr(c, 'name', locale),
        address: {
          '@type': 'PostalAddress',
          streetAddress: tr(c, 'address', locale),
          addressCountry: 'BD',
        },
      };
      if (c.phone_primary) {
        clinic.telephone = `+88${String(c.phone_primary).replace(/\D+/g, '')}`;
      }
      if (c.website) {
        clinic.url = c.website.startsWith('http') ? c.website : `https://${c.website}`;
      }
      if (c.map_url) {
        clinic.hasMap = c.map_url;
      }
      return clinic;
    }),
  };

  if (settings.facebook_url) {
    data.sameAs = [settings.facebook_url];
  }

  return data;
}

