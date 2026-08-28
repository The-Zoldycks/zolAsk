import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'zolAsk - Prompt Builder',
  description:
    'Transform your rough ideas into professional, detailed prompts with AI guidance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
