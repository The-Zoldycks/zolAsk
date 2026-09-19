import './globals.css';

export const metadata = { title: 'zolAsk — Prompt builder', description: 'Turn a rough idea into a clear, useful prompt.' };

export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
