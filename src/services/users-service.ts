import { IUser } from "../models/user";

class UserService {
    async getUsers() {
      const response = await fetch("http://localhost:3000/api/user", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const userResponse: IUser[] = await response.json();
  
      return userResponse;
    }
  
    async getUser(id: string) {
      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const userResponse: IUser = await response.json();
  
      return userResponse;
    }
  
    async updateUser(id: string, user: IUser) {
      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      const userResponse: IUser = await response.json();
  
      return userResponse;
    }
  
    async createUser(user: IUser) {
      const response = await fetch(`http://localhost:3000/api/user`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const userResponse: IUser = await response.json();
      return userResponse;
    }
  
    async deleteUser(id: string) {
      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const userResponse: IUser = await response.json();
      return userResponse;
    }
  }
  
  export { UserService };