import AboutSection from "@/components/sections/home/about-section";
import AchievementsSection from "@/components/sections/home/achievements-section";
import AspirationSection from "@/components/sections/AspirasiForm";
import DivisionsSection from "@/components/sections/home/divisions-section";
import EventsSection from "@/components/sections/home/events-section";
import GallerySection from "@/components/sections/home/gallery-section";
import HeroSection from "@/components/sections/home/hero-section";
import MembersSection from "@/components/sections/home/members-section";
import NewsSection from "@/components/sections/home/news-section";
import ProgramsSection from "@/components/sections/home/programs-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <MembersSection />
      <DivisionsSection />
      <ProgramsSection />
      <NewsSection />
      <EventsSection />
      <AchievementsSection />
      <GallerySection />
      <AspirationSection />
    </main>
  );
}
