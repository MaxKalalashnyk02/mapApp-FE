import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Problem from "@/components/sections/Problem";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import BusinessCta from "@/components/sections/BusinessCta";
import Faq from "@/components/sections/Faq";
import About from "@/components/sections/About";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(hasLocale(routing.locales, locale) ? locale : routing.defaultLocale);
  return (
    <main>
      <Hero />
      <Marquee />
      <Problem />
      <Features />
      <HowItWorks />
      <BusinessCta />
      <Faq />
      <About />
    </main>
  );
}
