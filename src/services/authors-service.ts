import { IAuthor } from "../models/author";

class AuthorsService {
  async getAuthors() {
    const response = await fetch("http://localhost:3000/api/author", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const bookAuthors: IAuthor[] = await response.json();

    return bookAuthors;
  }

  async getAuthor(id: string) {
    const response = await fetch(`http://localhost:3000/api/author/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const authorResponse: IAuthor = await response.json();

    return authorResponse;
  }

  async updateAuthor(id: string, author: IAuthor) {
    const response = await fetch(`http://localhost:3000/api/author/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(author),
    });

    const authorResponse: IAuthor = await response.json();

    return authorResponse;
  }

  async createAuthor(author: IAuthor) {
    const response = await fetch(`http://localhost:3000/api/author`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(author),
    });
    const authorResponse: IAuthor = await response.json();
    return authorResponse;
  }

  async deleteAuthor(id: string) {
    const response = await fetch(`http://localhost:3000/api/author/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const authorResponse: IAuthor = await response.json();
    return authorResponse;
  }
}

export { AuthorsService };
