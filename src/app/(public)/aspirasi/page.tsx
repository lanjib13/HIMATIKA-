import AspirasiForm from "@/components/sections/AspirasiForm";
import PageHeader from "@/components/ui/PageHeader";

export default function AspirationsPage() {
  return (
    <main className="public-interior public-aspiration-page">
      <PageHeader
        eyebrow="Ruang untuk suaramu"
        title="Aspirasi dan konsultasi."
        description="Sampaikan ide, masukan, atau pertanyaan kepada pengurus HIMATIKA."
      />
      <AspirasiForm />
    </main>
  );
}
