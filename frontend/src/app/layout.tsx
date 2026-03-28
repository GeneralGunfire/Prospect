import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prospect | Find Your Perfect Career Path",
  description: "Free career guidance for South African high school students (Grade 10–12)",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-prospect-dark">
        {children}
      </body>
    </html>
  );
}
