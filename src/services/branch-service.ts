import { IBranch } from "../models/branch";

class BranchService {
  async getBranches() {
    const response = await fetch(`http://localhost:3000/api/branch`);

    const branchResponse = await response.json();

    return branchResponse;
  }

  async getBranch(id: string) {
    const response = await fetch(`http://localhost:3000/api/branch/${id}`);

    const branchResponse = await response.json();

    return branchResponse;
  }

  async createBranch(branch: IBranch) {
    const response = await fetch("http://localhost:3000/api/branch", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: branch.name,
        country: branch.countryId,
        state: branch.stateId,
        city: branch.city,
        street: branch.street,
      }),
    });
    return response;
  }

  async updateBranch(id: string, branch: IBranch) {
    const response = await fetch(`http://localhost:3000/api/branch/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: branch.name,
        country: branch.countryId,
        state: branch.stateId,
        city: branch.city,
        street: branch.street,
      }),
    });
    return response;
  }

  async deleteBranch(id: string) {
    const response = await fetch(`http://localhost:3000/api/branch/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const branchResponse = await response.json();
    return branchResponse;
  }
}

export { BranchService };
