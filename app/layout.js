export const metadata = {
  title: 'zolAsk - Prompt Builder',
  description:
    'Transform your rough ideas into professional, detailed prompts with AI guidance',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Lucide React Icons */}
        <script src="https://unpkg.com/lucide@latest"></script>
        <style>{`
          * {
            @apply transition-colors duration-200;
          }
          body {
            @apply bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
