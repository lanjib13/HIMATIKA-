export default function PublicPageHeading({
  eyebrow = "HIMATIKA",
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <header className="public-page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="public-page-description">{description}</p>
    </header>
  );
}
