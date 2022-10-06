import { Ibook } from "../models/book";

class BookService {
  async getBooks() {
    const response = await fetch(`http://localhost:3000/api/book`);

    const bookResponse: Ibook[] = await response.json();
    return bookResponse;
  }

  async deleteBook(id: string) {
    const response = await fetch(`http://localhost:3000/api/book/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const bookResponse: Ibook = await response.json();
    return bookResponse;
  }

  async getBook(id: string) {
    const response = await fetch(`http://localhost:3000/api/book/${id}`);

    const bookResponse: Ibook = await response.json();
    return bookResponse;
  }

  async createBook(book: Ibook) {
    const response = await fetch("http://localhost:3000/api/book", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: book.name,
        year: book.year,
        author: book.author,
        editorial: book.editorial,
        stock: book.stock,
        price: book.price,
      }),
    });

    const bookResponse: Ibook = await response.json();
    return bookResponse;
  }

  async updateBook(id: string, book:Ibook) {
    const response = await fetch(`http://localhost:3000/api/book/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: book.name,
        year: book.year,
        author: book.author,
        editorial: book.editorial,
        stock: book.stock,
        price: book.price,
      }),
    });
    const bookResponse: Ibook = await response.json();
    return bookResponse;
  }
}
export { BookService };
