import axios from "axios";

const API_URL = "http://localhost:5000/api/reviews";

export type Review = {
  _id: string;
  reviewerId: {
    _id: string;
    name: string;
  } | null;
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

export const getPetReviews = async (
  petId: string,
  rating?: number
): Promise<ReviewsResponse> => {
  const response = await axios.get<ReviewsResponse>(API_URL, {
    params: {
      petId,
      ...(rating ? { rating } : {}),
    },
  });

  return response.data;
};