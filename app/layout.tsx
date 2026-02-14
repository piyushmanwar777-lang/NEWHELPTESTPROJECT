import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Valentine Love Story",
  description: "A romantic love story experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-apple antialiased page-transition`}
      >
        <div className="min-h-screen bg-gradient-to-br from-[var(--background-gradient-start)] to-[var(--background-gradient-end)]">
        {children}
        </div>
      </body>
    </html>
  );
}
