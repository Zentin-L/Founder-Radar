import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_MARKETING_URL || "http://localhost:3000"),
  title: "Founder Radar - Startup Discovery",
  description: "Real-time startup momentum tracking and founder intelligence platform",
  openGraph: {
    title: "Founder Radar",
    description: "Discover breakout startups before they raise.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Founder Radar",
    description: "The Bloomberg Terminal for startup momentum.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased relative`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
