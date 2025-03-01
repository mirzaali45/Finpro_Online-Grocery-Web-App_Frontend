<<<<<<< HEAD
<<<<<<< HEAD
import Link from "next/link";
=======
import  ProductCard  from "./ProductCard";
>>>>>>> 363474f74221ef62fc76f6c8ac1ec9ddcb3db94a
import { Product } from "@/types/product-types";
import { ProductImageSlider } from "@/components/product-list/ProductImgSlider";
=======
import  ProductCard  from "./ProductCard";
import { Product } from "@/types/product-types";
>>>>>>> 6fe60201730b8421f8ae35b8215b73a26def73dc

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  return (
<<<<<<< HEAD
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          href={`/product/${product.slug}`}
          key={product.product_id}
          className="block"
        >
          <div className="bg-neutral-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            {product.ProductImage && product.ProductImage.length > 0 && (
              <ProductImageSlider images={product.ProductImage} />
            )}

            <div className="p-4">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2 truncate">
                {product.name}
              </h3>

              <p className="text-neutral-400 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-purple-400">
                  Rp {product.price.toLocaleString()}
                </span>

                <span className="text-sm text-neutral-500">
                  {product.Inventory?.[0]?.total_qty || 0} in stock
                </span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-sm text-neutral-500">
                  {product.store.store_name}
                </span>
                <span className="text-sm text-neutral-500">
                  {product.category.category_name}
                </span>
              </div>
            </div>
          </div>
        </Link>
=======
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
>>>>>>> 6fe60201730b8421f8ae35b8215b73a26def73dc
      ))}
    </div>
  );
}
