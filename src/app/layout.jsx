import './globals.css';

export const metadata = {
  title: 'Dr. Md. Kamrul Hasan Sajib | Rheumatologist in Dhaka and Cumilla',
  description:
    'Rheumatologist in Dhanmondi, Dhaka and Cumilla. Arthritis, joint pain, gout, lupus and autoimmune care. Call to book.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

