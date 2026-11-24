import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPet } from "../api/petService";
import {
  getPetReviews,
  createReview,
  type Review,
  type ReviewsResponse,
} from "../api/reviewService";
import { petImages } from "../utils/petsImages";

type Pet = {
  _id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
  description: string;
};

function PetDetails() {
  const { id } = useParams();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  const [reviewData, setReviewData] = useState<ReviewsResponse>({
    totalReviews: 0,
    averageRating: 0,
    reviews: [],
  });
  const [reviewLoading, setReviewLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(
    undefined
  );
  const [reviewError, setReviewError] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");

  // Fetch pet details
  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);

      try {
        if (!id) {
          setPet(null);
          return;
        }

        const data = await getPet(id);
        setPet(data);
      } catch (error) {
        console.error("Error fetching pet:", error);
        setPet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  // Fetch reviews for this pet
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) {
        setReviewLoading(false);
        return;
      }

      setReviewLoading(true);
      setReviewError("");

      try {
        const data = await getPetReviews(id, ratingFilter);
        setReviewData(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviewError(
          "Unable to load reviews. Please try again later."
        );
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, [id, ratingFilter]);

  if (loading) {
    return (
      <h1 className="text-center text-3xl mt-20">Loading...</h1>
    );
  }

  if (!pet) {
    return (
      <h1 className="text-center text-4xl mt-20">Pet Not Found</h1>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto py-16 px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Pet Image */}
          <img
            src={petImages[pet.name] || pet.image}
            alt={pet.name}
            className="rounded-xl w-full h-[500px] object-cover shadow-lg"
          />

          {/* Pet Details */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {pet.name}
            </h1>

            <p className="text-xl text-gray-600 mb-6">
              {pet.breed}
            </p>

            <div className="space-y-3">
              <p>
                <strong>Age:</strong> {pet.age}
              </p>
              <p>
                <strong>Breed:</strong> {pet.breed}
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-3">
              About {pet.name}
            </h2>

            <p className="text-gray-600 leading-8">
              {pet.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/adopt"
                state={{ pet }}
                className="w-full sm:w-auto"
              >
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold">
                  Adopt Me ❤️
                </button>
              </Link>

              <Link to="/pets" className="w-full sm:w-auto">
                <button className="w-full bg-gray-300 hover:bg-gray-400 px-8 py-4 rounded-lg font-semibold">
                  Back to Pets
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16 border-t pt-10">
          <h2 className="text-3xl font-bold mb-4">
            Reviews for {pet.name}
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-lg font-semibold">
              ⭐ {reviewData.averageRating.toFixed(1)} / 5
            </p>
            <p className="text-gray-600 mt-1">
              Average rating for displayed reviews ·{" "}
              {reviewData.totalReviews} review(s)
            </p>
          </div>

          {/* Rating Filter */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <label
              htmlFor="ratingFilter"
              className="font-semibold"
            >
              Filter by rating:
            </label>

            <select
              id="ratingFilter"
              value={ratingFilter ?? "all"}
              onChange={(event) => {
                const value = event.target.value;
                setRatingFilter(
                  value === "all" ? undefined : Number(value)
                );
              }}
              className="border rounded-lg px-4 py-2 bg-white"
            >
              <option value="all">All ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 stars</option>
              <option value="4">⭐⭐⭐⭐ 4 stars</option>
              <option value="3">⭐⭐⭐ 3 stars</option>
              <option value="2">⭐⭐ 2 stars</option>
              <option value="1">⭐ 1 star</option>
            </select>
          </div>

          {/* Signed-in adopters can review this pet */}
          {localStorage.getItem("token") && JSON.parse(localStorage.getItem("user") || "{}").role === "adopter" && (
            <form
              className="mb-8 rounded-xl border bg-white p-5"
              onSubmit={async (event) => {
                event.preventDefault();
                setReviewError("");
                setReviewSuccess("");
                if (newComment.trim().length < 3 || newComment.trim().length > 1000) {
                  setReviewError("Review must contain 3 to 1000 characters.");
                  return;
                }
                if (!id) return;
                setReviewSubmitting(true);
                try {
                  await createReview({ petId: id }, newRating, newComment);
                  setNewComment("");
                  setNewRating(5);
                  const refreshed = await getPetReviews(id, ratingFilter);
                  setReviewData(refreshed);
                  setReviewSuccess("Thank you! Your review has been submitted.");
                } catch (error: any) {
                  setReviewError(error.response?.data?.message || "Unable to submit review.");
                } finally {
                  setReviewSubmitting(false);
                }
              }}
            >
              <h3 className="mb-3 text-lg font-semibold">Write a review</h3>
              <label className="mb-3 block text-sm font-medium">
                Your rating
                <select value={newRating} onChange={(event) => setNewRating(Number(event.target.value))} className="mt-1 block rounded-lg border p-2">
                  <option value={5}>5 stars</option><option value={4}>4 stars</option><option value={3}>3 stars</option><option value={2}>2 stars</option><option value={1}>1 star</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Your experience
                <textarea required minLength={3} maxLength={1000} value={newComment} onChange={(event) => setNewComment(event.target.value)} rows={3} className="mt-1 w-full rounded-lg border p-3" placeholder="Share your experience..." />
              </label>
              {reviewSuccess && <p role="status" className="mt-2 text-green-700">{reviewSuccess}</p>}
              <button disabled={reviewSubmitting} className="mt-3 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-60">
                {reviewSubmitting ? "Submitting..." : "Submit review"}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviewLoading ? (
            <p className="text-gray-600">Loading reviews...</p>
          ) : reviewError ? (
            <p className="text-red-600">{reviewError}</p>
          ) : reviewData.reviews.length === 0 ? (
            <p className="text-gray-600">
              No reviews found for this selection.
            </p>
          ) : (
            <div className="space-y-5">
              {reviewData.reviews.map((review: Review) => (
                <article
                  key={review._id}
                  className="border rounded-xl p-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="font-semibold">
                      {review.reviewerId?.name || "Adopter"}
                    </p>

                    <p className="text-yellow-500">
                      {"★".repeat(review.rating)}
                      <span className="text-gray-300">
                        {"★".repeat(5 - review.rating)}
                      </span>
                      <span className="text-gray-600 ml-2">
                        {review.rating}/5
                      </span>
                    </p>
                  </div>

                  <p className="text-gray-700 mt-3 whitespace-pre-wrap">
                    {review.comment}
                  </p>

                  <p className="text-sm text-gray-500 mt-3">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default PetDetails;