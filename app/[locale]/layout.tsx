import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import { locales, isLocale, dir, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { AuthProvider } from "@/lib/auth-context";
import { PlatformStoreProvider } from "@/lib/platform-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";

// Inter is the closest widely-available match to the clean grotesque Udemy uses for
// Latin text. It doesn't cover Arabic glyphs, so the browser automatically falls back
// to Noto Sans Arabic (next in the font stack, see tailwind.config.ts) for Arabic
// characters — no per-locale font-switching logic needed.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-arabic",
  display: "swap"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap"
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ar";
  const dict = getDictionary(locale);
  const title = `${dict.meta.siteName} — ${dict.meta.tagline}`;

  return {
    metadataBase: new URL("https://mujtamaaty.example"),
    title: {
      default: title,
      template: `%s · ${dict.meta.siteName}`
    },
    description: dict.meta.defaultDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en"
      }
    },
    openGraph: {
      title,
      description: dict.meta.defaultDescription,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dict.meta.defaultDescription
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ar";
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale} dir={dir(locale)} className={`${inter.variable} ${notoSansArabic.variable} ${plexMono.variable}`}>
      <body>
        <PlatformStoreProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar locale={locale} dict={dictionary} />
              <main className="flex-1">{children}</main>
              <Footer locale={locale} dict={dictionary} />
              <ScrollToTopButton />
            </div>
          </AuthProvider>
        </PlatformStoreProvider>
      </body>
    </html>
  );
}
