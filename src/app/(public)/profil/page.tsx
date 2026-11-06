import AboutSection from "@/components/sections/home/about-section";
import PageHeader from "@/components/ui/PageHeader";

export default function ProfilePage() {
  return (
    <main className="public-interior">
      <PageHeader
        eyebrow="Tentang HIMATIKA"
        title="Mengenal HIMATIKA."
        description="Sejarah, visi, dan misi Himpunan Mahasiswa Informatika."
      />
      <AboutSection />
    </main>
  );
}
