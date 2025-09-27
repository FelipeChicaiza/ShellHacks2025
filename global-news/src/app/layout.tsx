import type { Metadata } from "next";
// Import the new fonts from next/font/google
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

// Configure Bebas Neue for the title
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue", // Creates a CSS variable
  subsets: ["latin"],
  weight: "400", // Specify the weight you need
  display: "swap",
});

// Configure DM Sans for the body text
const dmSans = DM_Sans({
  variable: "--font-dm-sans", // Creates another CSS variable
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Global News Network",
  description: "Explore trusted local stories around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Add the font variables to the body's className */}
      <body className={`${bebasNeue.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}