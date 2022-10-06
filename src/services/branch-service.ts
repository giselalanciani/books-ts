import { IBranch } from "../models/branch";

class BranchService {
  async getBranches() {
    const response = await fetch(`http://localhost:3000/api/branch`);

    const branchResponse: IBranch[] = await response.json();

    return branchResponse;
  }

  async getBranch(id: string) {
    const response = await fetch(`http://localhost:3000/api/branch/${id}`);

    const branchResponse: IBranch = await response.json();

    return branchResponse;
  }

  async createBranch(branch: IBranch) {
    const response = await fetch("http://localhost:3000/api/branch", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(branch),
    });
    const branchResponse: IBranch = await response.json();
    return branchResponse;
  }

  async updateBranch(id: string, branch: IBranch) {
    const response = await fetch(`http://localhost:3000/api/branch/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(branch),
    });
    const branchResponse: IBranch = await response.json();
    return branchResponse;
  }

  async deleteBranch(id: string) {
    const response = await fetch(`http://localhost:3000/api/branch/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const branchResponse: IBranch = await response.json();
    return branchResponse;
  }
}

export { BranchService };
