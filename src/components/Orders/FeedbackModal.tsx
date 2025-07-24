"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

type FeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  orderId: number;
};

export default function FeedbackModal({
  isOpen,
  onClose,
  userId,
  orderId,
}: FeedbackModalProps) {
  const [ratingProduct, setRatingProduct] = useState(5);
  const [ratingDA, setRatingDA] = useState(5);
  const [commentProduct, setCommentProduct] = useState("");
  const [commentDA, setCommentDA] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!userId || !orderId) {
      alert("Missing user or order information.");
      return;
    }

    if (ratingProduct <= 3 && commentProduct.trim() === "") {
      alert("Please provide a comment for the product if rating is 3 or below.");
      return;
    }

    if (ratingDA <= 3 && commentDA.trim() === "") {
      alert("Please provide a comment for the delivery agent if rating is 3 or below.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          order_id: orderId,
          rating_product: ratingProduct,
          rating_da: ratingDA,
          comment_product: commentProduct,
          comment_da: commentDA,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error("❌ Feedback error:", error.message);
      alert(`Failed to submit feedback. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (value: number, setValue: (v: number) => void) => {
    return (
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((val) => (
          <span
            key={val}
            className={`cursor-pointer text-2xl ${
              val <= value ? "text-yellow-500" : "text-gray-300"
            }`}
            onClick={() => setValue(val)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">Feedback</Dialog.Title>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <p className="text-green-600 font-medium text-center">
              ✅ Thank you for your feedback!
            </p>
          ) : (
            <div className="space-y-5">
              {/* Product Rating */}
              <div>
                <label className="block font-medium">Product Rating</label>
                {renderStars(ratingProduct, setRatingProduct)}
              </div>

              <div>
                <label className="block font-medium">Product Comment</label>
                <textarea
                  value={commentProduct}
                  onChange={(e) => setCommentProduct(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                  rows={3}
                  placeholder={
                    ratingProduct <= 3 ? "Required if rating is 3 or less" : "Optional"
                  }
                />
              </div>

              {/* DA Rating */}
              <div>
                <label className="block font-medium">Delivery Agent Rating</label>
                {renderStars(ratingDA, setRatingDA)}
              </div>

              <div>
                <label className="block font-medium">Delivery Agent Comment</label>
                <textarea
                  value={commentDA}
                  onChange={(e) => setCommentDA(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                  rows={3}
                  placeholder={ratingDA <= 3 ? "Required if rating is 3 or less" : "Optional"}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-4 w-full bg-trendy-500 hover:bg-trendy-600 text-white py-2 rounded-md"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
