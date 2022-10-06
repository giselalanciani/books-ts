import { IEditorial } from "../models/editorial";

class EditorialService {
  async getEditorials() {
    const response = await fetch("http://localhost:3000/api/editorial", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const editorialResponse: IEditorial[] = await response.json();

    return editorialResponse;
  }

  async getEditorial(id: string) {
    const response = await fetch(`http://localhost:3000/api/editorial/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const editorialResponse: IEditorial = await response.json();

    return editorialResponse;
  }

  async createEditorial(editorial: IEditorial) {
    const response = await fetch(`http://localhost:3000/api/editorial`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editorial.name,
      }),
    });
    const editorialResponse: IEditorial = await response.json();
    return editorialResponse;
  }

  async updateEditorial(id: string, editorial:IEditorial) {
    const response = await fetch(`http://localhost:3000/api/editorial/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editorial),
    });

    const editorialResponse: IEditorial = await response.json();

    return editorialResponse;
  }

  async deleteEditorial(id:string) {
    const response = await fetch(`http://localhost:3000/api/editorial/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const editorialResponse: IEditorial = await response.json();
    return editorialResponse;
  }
}

export { EditorialService };
