import { IState } from "../models/state";

class StateService {
  async getStates(countryId: string) {
    const response = await fetch(
      `http://localhost:3000/api/state/${countryId}`
    );

    return await response.json();
  }

  async getState(countryId: string, stateId: string) {
    const response = await fetch(
      `http://localhost:3000/api/state/${countryId}/${stateId}`
    );

    return await response.json();
  }

  async deleteState(countryId: string, stateId: string) {
    const response = await fetch(
      `http://localhost:3000/api/state/${countryId}/${stateId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  }

  async createState(state: string) {
    const response = await fetch("http://localhost:3000/api/state", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    return response;
  }

  async updateState(countryId: string, state: IState) {
    const response = await fetch(
      `http://localhost:3000/api/state/${countryId}/${state.id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      }
    );

    return await response.json();
  }
}
export { StateService };
