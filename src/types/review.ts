export interface Review {
  id: string;
  projectId: string;
  uid: string;
  displayName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
