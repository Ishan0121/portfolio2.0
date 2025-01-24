import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
// import { AnimatedGrid } from '@/components/animated-grid';
import { OnlyGrid } from '@/components/only-grid';
import { getRandomFavicon } from '@/lib/utils';
import { PageWrapper } from './pageWrapper';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Portfolio | Creative Developer',
  icons: `/images/${getRandomFavicon()}`,
  description: 'Personal portfolio showcasing my work and experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col items-center">
            <Navigation />
            {/* <AnimatedGrid /> */}
            <OnlyGrid />
            <main className="flex-1 px-10 container select-none">
              {/* {children}  */}
              {/* in the code below its makes a client side code is written on pageWrapper.tsx to allow an animation to work  */}
              <PageWrapper>{children}</PageWrapper>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}



// import "./globals.css";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import { ThemeProvider } from "@/components/theme-provider";
// import { Navigation } from "@/components/navigation";
// import { Footer } from "@/components/footer";
// import { getRandomFavicon } from "@/lib/utils";
// import { PageWrapper } from "./pageWrapper";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Portfolio | Creative Developer",
//   icons: `/images/${getRandomFavicon()}`,
//   description: "Personal portfolio showcasing my work and experience",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//           <div className="flex min-h-screen flex-col items-center">
//             <Navigation />
//             <main className="flex-1 px-10 container">
//               <PageWrapper>{children}</PageWrapper>
//             </main>
//             <Footer />
//           </div>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
