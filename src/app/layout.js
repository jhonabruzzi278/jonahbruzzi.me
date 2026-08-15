import MainProvider from "@components/provider/main-provider";
// Pre-compiled third-party CSS — imported directly here (not via Sass
// @import in globals.scss) so Next's CSS pipeline handles it as plain CSS.
import "swiper/css/bundle";
import "slick-carousel/slick/slick.css";
import "react-tooltip/dist/react-tooltip.css";
import "./globals.scss";
import { Inter, Libre_Baskerville } from "next/font/google";
import { siteConfig } from "@config/site";

// next/font only accepts a single `variable` string — extra aliases
// (--tp-ff-body, --tp-ff-p, --jb-ff-heading) are defined in _root.scss
// instead, pointing back at these two.
const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-inter",
});
const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--tp-ff-heading",
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${libreBaskerville.variable}`}>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
