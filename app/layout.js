import './globals.css';

export const metadata = {
  title: 'zolAsk - Prompt Builder',
  description:
    'Transform your rough ideas into professional, detailed prompts with AI guidance',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
