import Image from "next/image";
import Link from "next/link";
import type { components } from "@/lib/api/schema";
import { formatRupiah } from "./demo-store";

type TokrafProduct = components["schemas"]["TokrafProduct"];

export default function ProductCard({
  product,
  categoryName,
}: {
  product: TokrafProduct;
  categoryName: string;
}) {
  const startingPrice = Math.min(
    ...product.price_tiers.map((tier) => tier.unit_price),
  );

  return (
    <Link
      className="tokraf-product-card"
      href={`/tokraf/produk/${product.slug}`}
    >
      <div className="tokraf-product-art">
        {product.foto ? (
          <Image
            alt={product.nama}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
            src={product.foto}
            unoptimized
          />
        ) : (
          <span aria-hidden="true">{product.nama.slice(0, 2).toUpperCase()}</span>
        )}
        <span className="tokraf-demo-tag">DEMO</span>
      </div>
      <div className="tokraf-product-card-copy">
        <div className="tokraf-product-meta">
          <span>{categoryName}</span>
          <span>Mulai dari</span>
        </div>
        <h3>{product.nama}</h3>
        <strong>{formatRupiah(startingPrice)}</strong>
        <span className="tokraf-card-link">Lihat detail ↗</span>
      </div>
    </Link>
  );
}
