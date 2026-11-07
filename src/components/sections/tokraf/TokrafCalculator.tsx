"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatRupiah, getUnitPrice, useTokrafDemoStore } from "./demo-store";

function CalculatorForm() {
  const searchParams = useSearchParams();
  const { data, ready, error } = useTokrafDemoStore();
  const products = data?.products.filter((item) => item.status === "terbit") ?? [];
  const [productSlug, setProductSlug] = useState(searchParams.get("produk") ?? "");
  const [quantity, setQuantity] = useState("1");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [options, setOptions] = useState<Record<string, string>>({});
  const product = products.find((item) => item.slug === productSlug) ?? products[0];
  const count = Number(quantity);
  const optionValues = Object.fromEntries(
    (product?.variants ?? []).map((variant) => [
      variant.name,
      options[variant.name] ?? variant.options[0]?.value ?? "",
    ]),
  );

  const unitPrice =
    product && Number.isSafeInteger(count) && count > 0
      ? getUnitPrice(product, count, optionValues)
      : null;
  const total = unitPrice === null ? null : unitPrice * count;
  const selectedVariants =
    product?.variants.map((variant) => ({
        name: variant.name,
        label:
          variant.options.find((option) => option.value === optionValues[variant.name])
            ?.label ?? "Belum dipilih",
      })) ?? [];

  const whatsappNumber = data?.profile.whatsapp_number ?? "";
  const validWhatsAppNumber = /^[1-9]\d{7,14}$/.test(whatsappNumber);
  const whatsappMessage = [
    `Halo ${data?.profile.nama_toko ?? "TOKRAF"}, saya ingin menanyakan pesanan:`,
    `Produk: ${product?.nama ?? "-"}`,
    ...selectedVariants.map((variant) => `${variant.name}: ${variant.label}`),
    `Jumlah: ${Number.isFinite(count) && count > 0 ? count : "-"}`,
    `Estimasi demo: ${total === null ? "-" : formatRupiah(total)}`,
    `Nama: ${name.trim() || "-"}`,
    `Catatan: ${note.trim() || "-"}`,
    "Mohon konfirmasi harga final dan ketersediaan. Saya memahami harga ini hanya estimasi.",
  ].join("\n");
  const whatsappHref = validWhatsAppNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : undefined;

  if (error) {
    return <p className="tokraf-alert" role="alert">{error}</p>;
  }
  if (!ready) return <p className="tokraf-empty">Memuat kalkulator…</p>;
  if (!product) {
    return (
      <div className="tokraf-empty">
        Belum ada produk terbit. Admin dapat menambahkannya melalui dashboard
        demo.
      </div>
    );
  }

  return (
    <div className="tokraf-calculator-grid">
      <form className="tokraf-form-card">
        <label className="tokraf-field">
          Produk
          <select
            onChange={(event) => {
              setProductSlug(event.target.value);
              setOptions({});
            }}
            value={products.some((item) => item.slug === productSlug) ? productSlug : product.slug}
          >
            {products.map((item) => (
              <option key={item.id_produk} value={item.slug}>
                {item.nama}
              </option>
            ))}
          </select>
        </label>
        {product.variants.map((variant) => (
          <label className="tokraf-field" key={variant.name}>
            {variant.name}
            <select
              onChange={(event) =>
                setOptions((current) => ({
                  ...current,
                  [variant.name]: event.target.value,
                }))
              }
              required={variant.required}
              value={optionValues[variant.name] ?? ""}
            >
              {variant.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                  {option.price_adjustment
                    ? ` (+${formatRupiah(option.price_adjustment)})`
                    : ""}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label className="tokraf-field">
          Jumlah
          <input
            min={1}
            onChange={(event) => setQuantity(event.target.value)}
            required
            type="number"
            value={quantity}
          />
        </label>
        <label className="tokraf-field">
          Nama <span>(opsional)</span>
          <input
            autoComplete="name"
            maxLength={100}
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </label>
        <label className="tokraf-field">
          Catatan pesanan <span>(opsional)</span>
          <textarea
            maxLength={500}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            value={note}
          />
        </label>
      </form>

      <aside className="tokraf-order-summary">
        <p className="tokraf-eyebrow">Ringkasan pesanan</p>
        <h2>{product.nama}</h2>
        <dl>
          {selectedVariants.map((variant) => (
            <div key={variant.name}>
              <dt>{variant.name}</dt>
              <dd>{variant.label}</dd>
            </div>
          ))}
          <div>
            <dt>Jumlah</dt>
            <dd>{Number.isFinite(count) && count > 0 ? count : "—"}</dd>
          </div>
          <div>
            <dt>Harga satuan estimasi</dt>
            <dd>{unitPrice === null ? "—" : formatRupiah(unitPrice)}</dd>
          </div>
        </dl>
        <div className="tokraf-order-total">
          <span>Total estimasi</span>
          <strong>{total === null ? "Periksa jumlah" : formatRupiah(total)}</strong>
        </div>
        <p className="tokraf-price-note">
          Harga demo menggunakan rentang kuantitas dan belum termasuk
          pengiriman. Admin akan mengonfirmasi harga final.
        </p>
        {whatsappHref ? (
          <a
            className="tokraf-button tokraf-button-dark tokraf-button-full"
            href={whatsappHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            Pesan via WhatsApp <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <div>
            <button
              className="tokraf-button tokraf-button-dark tokraf-button-full"
              disabled
              type="button"
            >
              WhatsApp toko belum diatur
            </button>
            <p className="tokraf-form-note">
              Atur nomor demo dari{" "}
              <Link href="/dashboard/tokraf/profil">profil toko admin</Link>.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default function TokrafCalculator() {
  return (
    <main className="tokraf-page tokraf-interior">
      <header className="tokraf-page-heading">
        <p className="tokraf-eyebrow">Kalkulator pesanan</p>
        <h1>Rencanakan pesananmu.</h1>
        <p>Pilih produk dan varian untuk mendapatkan estimasi harga bertingkat.</p>
      </header>
      <div className="tokraf-demo-banner">
        MODE DEMO — harga ilustrasi, tidak mengikat, dan tidak disimpan sebagai
        pesanan.
      </div>
      <Suspense fallback={<p className="tokraf-empty">Memuat kalkulator…</p>}>
        <CalculatorForm />
      </Suspense>
    </main>
  );
}
