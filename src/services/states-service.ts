import { ICountry } from "../models/country";
import { IState } from "../models/state";

class StateService {
  async getStates(countryId: string) {
    const response = await fetch(
      `http://localhost:3000/api/state/${countryId}`
    );

    const states: IState[] = await response.json();
    return states;
  }

  async getState(countryId: string, stateId: string) {
    const response = await fetch(
      `http://localhost:3000/api/state/${countryId}/${stateId}`
    );

    const state: IState = await response.json();
    return state;
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
    const state: IState = await response.json();

    return state;
  }

  async createState(state: IState) {
    const response = await fetch("http://localhost:3000/api/state", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    const stateResponse: IState = await response.json();
    return stateResponse;
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
    const stateResponse: IState = await response.json();

    return stateResponse;
  }
}
export { StateService };
