import { ICategory } from "../models/category";

class CategoriesServices {
  async getCategories() {
    const response = await fetch(`http://localhost:3000/api/categories`);

    const categoriesResponse: ICategory[] = await response.json();
    return categoriesResponse;
  }

  async getCategory(id: string) {
    const response = await fetch(`http://localhost:3000/api/categories/${id}`);

    const categoriesResponse: ICategory = await response.json();
    return categoriesResponse;
  }

  async deleteCategory(id: string) {
    const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const categoriesResponse: ICategory = await response.json();
    return categoriesResponse;
  }

  async createCategory(category: ICategory) {
    const response = await fetch(`http://localhost:3000/api/categories`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    const categoriesResponse: ICategory = await response.json();
    return categoriesResponse;
  }

  async updateCategory(id: string, category: ICategory) {
    const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    const countryResponse: ICategory = await response.json();
    return countryResponse;
  }
}
export { CategoriesServices };
