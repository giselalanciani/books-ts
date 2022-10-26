interface ICredential {
  email: string;
  password: string;
}

interface IToken {
    token: string
}

interface ITokenPayload {
  role: string;
}
export { ICredential, IToken , ITokenPayload};
