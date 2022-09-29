import { IAuthor } from "../models/author";

class AuthorsService {
  async getAuthors() {
    const bookAuthors = await fetch("http://localhost:3000/api/author", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const responseData = await bookAuthors.json();

    return responseData;
  }

  async getAuthor(id: string) {
    const bookAuthor = await fetch(`http://localhost:3000/api/author/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const responseData = await bookAuthor.json();

    return responseData;
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

    const responseData = await response.json();

    return responseData;
  }

  async createAuthor(author: IAuthor) {
    const authorResponse = await fetch(`http://localhost:3000/api/author`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(author),
    });

    return await authorResponse.json();
  }

  async deleteAuthor(id: string) {
    const response = await fetch(`http://localhost:3000/api/author/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }
}

export { AuthorsService };
