export function ResourceStatus({
  loading,
  error,
  empty,
}: {
  loading: boolean;
  error: string | null;
  empty: string;
}) {
  if (loading) {
    return (
      <p className="resource-status" role="status">
        Memuat data dari API…
      </p>
    );
  }
  if (error) {
    return (
      <p className="resource-status resource-error" role="alert">
        {error}
      </p>
    );
  }
  return <p className="resource-status">{empty}</p>;
}

export function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(date);
}
