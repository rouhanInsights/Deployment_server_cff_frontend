"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";

type Product = {
  name: string;
  image: string;
  price: string;
  sale_price?: string;
  weight?: string;
  description?: string;
  short_description?: string;
  discount?: string;
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart, removeFromCart, cart } = useCart();
  const quantity = cart.items.find((item) => item.id === id)?.quantity || 0;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (!id || typeof id !== "string") return <p className="p-4 text-red-500">Invalid product ID</p>;
  if (loading) return <p className="p-4">Loading product details...</p>;
  if (!product) return <p className="p-4 text-red-500">Product not found</p>;

  const {
    name,
    image,
    price,
    sale_price,
    weight,
    description,
    short_description,
    discount,
  } = product;

  const displayPrice = parseFloat(sale_price ?? price);
  const originalPrice = sale_price ? parseFloat(price) : null;
  const discountValue = parseInt(discount ?? "0", 10);

  return (
    <section className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md mt-8">
      {/* Back to Products Top Link */}
      <button
        onClick={() => window.history.back()}
        className="text-sm text-gray-500 hover:text-black mb-6"
      >
        ← Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* ✅ Zoom & Crop Image Section */}
        <div className="relative aspect-square w-full max-w-md bg-gray-100 mx-auto rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-center w-full h-full"
            sizes="1000vw, 50vw"
          />
          {discountValue > 0 && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
              {discountValue}% OFF
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
          <p className="text-sm text-gray-600">{weight || "Standard Pack"}</p>

          {short_description && (
            <p className="text-sm text-gray-500 italic">{short_description}</p>
          )}

          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-1">
              Product Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description || "No detailed description available."}
            </p>
          </div>

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between mt-6 gap-4">
            <div className="text-3xl font-bold text-[#2F4F1C]">
              ₹{displayPrice.toFixed(2)}
              {originalPrice && (
                <span className="text-lg text-gray-400 line-through ml-2 font-normal">
                  ₹{originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {quantity > 0 ? (
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden text-sm shadow">
                <button
                  onClick={() => removeFromCart(id)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 flex justify-center items-center"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-semibold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    addToCart({ id, name, price: displayPrice, image, weight })
                  }
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 flex justify-center items-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  addToCart({ id, name, price: displayPrice, image, weight })
                }
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm shadow transition"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
