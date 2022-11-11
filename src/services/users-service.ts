import { ICredential, IToken, ITokenPayload } from "../models/login";
import { IUser } from "../models/user";
import jwt_decode from "jwt-decode";

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

  async logIn(credential: ICredential) {
    try {
      const response = await fetch(`http://localhost:3000/api/user/sign-in`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credential),
      });

      if (response.status === 200) {
        const userResponse = await response.json();
        this.saveUserToken(userResponse);
        return userResponse;
      } else {
        const errorMessageObject = await response.json();
        const error = new Error();
        error.message = errorMessageObject;
        error.name = "BACKEND_ERROR";
        throw error;
      }
    } catch (error) {
      throw error;
    } finally {
    }
  }

  saveUserToken(token: IToken) {
    const decodedToken: ITokenPayload = jwt_decode(token.token);
    console.log("decodedToken payload", decodedToken);
    localStorage.setItem("role", decodedToken.role);
    localStorage.setItem("token", token.token);
  }

  logOut() {
    localStorage.clear();
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
