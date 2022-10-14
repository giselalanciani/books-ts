import { IClient } from "../models/client";

class ClientService {
  async getClients() {
    const response = await fetch(`http://localhost:3000/api/clients`);

    const clientResponse: IClient[] = await response.json();
    return clientResponse;
  }

  async getClient(id: string) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`);

    const clientResponse: IClient = await response.json();
    return clientResponse;
  }

  async createClient(client: IClient) {
    const response = await fetch("http://localhost:3000/api/clients", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(client),
    });

    const clientResponse: IClient = await response.json();
    return clientResponse;
  }

  async updateClient(id: string, client: IClient) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(client),
    });
    const clientResponse: IClient = await response.json();
    return clientResponse;
  }
  async deleteClient(id: string) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const clientResponse: IClient = await response.json();
    return clientResponse;
  }
}
export { ClientService };
