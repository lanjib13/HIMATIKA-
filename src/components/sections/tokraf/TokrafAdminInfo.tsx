import Link from "next/link";

export default function TokrafAdminInfo({
  page,
}: {
  page: "orders" | "settings";
}) {
  if (page === "orders") {
    return (
      <section className="tokraf-admin-page">
        <header className="admin-page-heading">
          <div>
            <span className="admin-eyebrow">TOKRAF · PESANAN</span>
            <h1>Pesanan WhatsApp.</h1>
            <p>Website demo tidak menyimpan atau menerima pesanan WhatsApp.</p>
          </div>
        </header>
        <div className="tokraf-admin-info-card">
          <h2>Belum ada daftar pesanan di dashboard</h2>
          <p>
            Pengunjung mengirim ringkasan langsung ke WhatsApp. Konfirmasi harga
            final, pembayaran QRIS/transfer, COD, dan invoice Paper.id diproses
            admin di luar website. API baru dapat menampilkan pesanan jika
            backend kelak menerima dan menyimpannya.
          </p>
          <Link className="admin-secondary-button" href="/tokraf/cara-pesan">
            Lihat alur pemesanan ↗
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="tokraf-admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">TOKRAF · PENGATURAN</span>
          <h1>Operasional toko.</h1>
          <p>Informasi alur transaksi yang berjalan di luar website.</p>
        </div>
      </header>
      <div className="tokraf-admin-info-card">
        <h2>Pembayaran dan pengiriman</h2>
        <ul>
          <li>Pembayaran dibicarakan melalui WhatsApp (QRIS atau transfer).</li>
          <li>Pengiriman yang disepakati pada PRD adalah COD.</li>
          <li>Invoice resmi dan administrasi keuangan ditangani admin melalui Paper.id.</li>
          <li>Website tidak memproses pembayaran atau menyimpan data pesanan.</li>
        </ul>
        <Link className="admin-secondary-button" href="/dashboard/tokraf/profil">
          Atur kontak toko ↗
        </Link>
      </div>
    </section>
  );
}
