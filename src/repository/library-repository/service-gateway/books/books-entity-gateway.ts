import { Books } from 'src/constants/dto/books/sql-books';

export default interface BooksEntityGateway {
  getBookById(id: string): Promise<any>;
  createBook(book: Books): Promise<any>;
}
