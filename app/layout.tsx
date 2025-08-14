import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the app
export const metadata: Metadata = {
  title: "UNARP - Urgent Needs Assistance Relief Program",
  description: "Providing emergency financial help for individuals and families facing urgent hardship.",
  icons: {
    icon: "/favicon-greendot.ico", // Favicon for tabs
    apple: "/favicon-greendot.ico", // Apple devices
  },
  viewport: "width=device-width, initial-scale=1.0", // Correct placement

  // Open Graph Metadata
  openGraph: {
    title: "UNARP - Emergency Financial Assistance",
    description:
      "Access quick and secure grants for rent, food, medical bills, and utilities to support you during tough times",
    siteName: "UNARP",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://unarp.org/unaplogo.jpg",
        width: 1200,
        height: 630,
        alt: "UNARP Assistance",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon and metadata are auto-injected by Next.js */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
