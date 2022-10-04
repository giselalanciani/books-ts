import { ICountry } from "../models/country";

class CountryServices {
  async getCountries() {
    const response = await fetch(`http://localhost:3000/api/country`);

    const countryResponse = await response.json();
    return countryResponse;
  }

  async getCountry(id: string) {
    const response = await fetch(`http://localhost:3000/api/country/${id}`);

    const countryResponse = await response.json();
    return countryResponse;
  }

  async deleteCountry(id: string) {
    const response = await fetch(`http://localhost:3000/api/country/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const countryResponse = await response.json();
    return countryResponse;
  }

  async createCountry(country: ICountry) {
    const response = await fetch(`http://localhost:3000/api/country`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(country),
    });

    const countryResponse = await response.json();
    return countryResponse;
  }

  async updateCountry(country: ICountry) {
    const response = await fetch(
      `http://localhost:3000/api/country/${country.id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(country),
      }
    );
    const countryResponse = await response.json();
    return countryResponse;
  }
}
export { CountryServices };
