export type Review = {
  _id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { _id: string } | string | null;
};
