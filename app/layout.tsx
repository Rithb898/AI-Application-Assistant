import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/Navbar";
import { PostHogProvider } from "@/components/PostHogProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Consider 'swap' for better perceived performance
  preload: true, // Preload the font for faster rendering
});

export const metadata: Metadata = {
  title: {
    default: "FitForJob - AI Application Assistant",
    template: "%s | FitForJob",
  },
  description:
    "Create personalized job application materials with AI assistance",
    keywords: ["AI", "Job Application", "Resume", "Cover Letter", "Career", "Assistant", "Job Search"], // Add relevant keywords
    authors: [{ name: 'Rith Banerjee', url: 'https://fitforjob.vercel.app/' }], // Optional author info
    openGraph: {
      title: "FitForJob - AI Application Assistant",
      description: "Create personalized job application materials with AI assistance",
      url: "https://fitforjob.vercel.app/",
      siteName: "FitForJob",
      images: [
        {
          url: "/fitforjob-og.png",
          width: 1200,
          height: 630,
          alt: "FitForJob - AI Application Assistant",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      title: "FitForJob - AI Application Assistant",
      description: "Create personalized job application materials with AI assistance",
      creator: '@@rithcoderr',
      images: ['/fitforjob-og.png'],
  },
  viewport: { // Explicitly set viewport (often good practice)
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
  },
  robots: { // Control indexing by search engines (optional)
      index: true,
      follow: true,
  },
  icons: { // Favicons and app icons
      icon: '/favicon.ico', // Default favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <Toaster position='top-right' reverseOrder={false} />
            <Navbar />
            {children}
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
