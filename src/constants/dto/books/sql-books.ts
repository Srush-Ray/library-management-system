export interface Books {
  book_id: string;
  book_name: string;
  author_name: string;
  genre?: string;
  total_copies?: number;
  available_copies?: number;
}
