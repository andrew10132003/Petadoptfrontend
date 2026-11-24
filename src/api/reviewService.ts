import api from "../utils/api";

export type Review = {
  _id: string;
  reviewerId: { _id: string; name: string } | null;
  petId: string | null;
  shelterId: string | null;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ReviewsResponse = {
  totalReviews: number;
  averageRating: number;
  reviews: Review[];
};

type ReviewTarget = { petId: string } | { shelterId: string };

export const getPetReviews = async (
  petId: string,
  rating?: number
): Promise<ReviewsResponse> => {
  const response = await api.get<ReviewsResponse>("/reviews", {
    params: { petId, ...(rating ? { rating } : {}) },
  });
  return response.data;
};

export const getShelterReviews = async (
  shelterId: string,
  rating?: number
): Promise<ReviewsResponse> => {
  const response = await api.get<ReviewsResponse>("/reviews", {
    params: { shelterId, ...(rating ? { rating } : {}) },
  });
  return response.data;
};

export const createReview = async (
  target: ReviewTarget,
  rating: number,
  comment: string
) => {
  const response = await api.post("/reviews", {
    ...target,
    rating,
    comment: comment.trim(),
  });
  return response.data;
};
