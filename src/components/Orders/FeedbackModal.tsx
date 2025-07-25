"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Star } from "lucide-react";

export default function FeedbackModal({ token, productId }: { token: string; productId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [ratingProduct, setRatingProduct] = useState(5);
  const [ratingDA, setRatingDA] = useState(5);
  const [commentProduct, setCommentProduct] = useState("");
  const [commentDA, setCommentDA] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        rating_product: ratingProduct,
        comment_product: ratingProduct <= 3 ? commentProduct : "",
        rating_da: ratingDA,
        comment_da: ratingDA <= 3 ? commentDA : "",
      }),
    });

    if (res.ok) {
      setSubmitted(true);
      setTimeout(() => setIsOpen(false), 1500);
    } else {
      alert("Failed to submit feedback");
    }
  };

  return (
    <>
      <button
        className="mt-3 text-sm text-[#8BAD2B] font-medium underline"
        onClick={() => setIsOpen(true)}
      >
        Leave Feedback
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4">
            <Dialog.Title className="text-lg font-bold text-gray-800">Feedback</Dialog.Title>

            {submitted ? (
              <p className="text-green-600 text-sm">✅ Feedback submitted successfully!</p>
            ) : (
              <>
                {/* Product Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <Star
                        key={val}
                        className={`w-5 h-5 cursor-pointer ${
                          val <= ratingProduct ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRatingProduct(val)}
                      />
                    ))}
                  </div>
                  {ratingProduct <= 3 && (
                    <textarea
                      className="mt-2 w-full border rounded p-2 text-sm"
                      placeholder="What was wrong with the product?"
                      value={commentProduct}
                      onChange={(e) => setCommentProduct(e.target.value)}
                    />
                  )}
                </div>

                {/* Delivery Agent Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Agent Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <Star
                        key={val}
                        className={`w-5 h-5 cursor-pointer ${
                          val <= ratingDA ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRatingDA(val)}
                      />
                    ))}
                  </div>
                  {ratingDA <= 3 && (
                    <textarea
                      className="mt-2 w-full border rounded p-2 text-sm"
                      placeholder="What was wrong with the delivery?"
                      value={commentDA}
                      onChange={(e) => setCommentDA(e.target.value)}
                    />
                  )}
                </div>

                <button
                  className="mt-4 w-full bg-[#8BAD2B] text-white py-2 rounded hover:bg-[#7b9c24]"
                  onClick={handleSubmit}
                >
                  Submit Feedback
                </button>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
