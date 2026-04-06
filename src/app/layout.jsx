import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Providers from "@/components/Providers";

export const metadata = {
  title: "ExamForge — Question Paper System",
  description:
    "Create, view, and attempt question papers in JEE-style exam mode",
};

// Inline script runs before hydration to set data-theme from localStorage
// This prevents the flash of wrong theme on first load
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('examforge_theme') || 'dark';
    console.log('Loaded theme:', theme);
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body style={{ position: "relative", zIndex: 1 }}>
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
